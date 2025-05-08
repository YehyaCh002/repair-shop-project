import pool from '../config/db.js';
import crypto from 'crypto';

export const generateTrackingNumber = () =>
  crypto.randomBytes(8).toString('hex');

const addClient = async (clientData, clientConn) => {
  const { client_username, client_number, client_email } = clientData;
  const query = `
    INSERT INTO client (client_username, client_number, client_email)
    VALUES ($1, $2, $3)
    RETURNING id_client
  `;
  const { rows } = await clientConn.query(query, [client_username, client_number, client_email]);
  return rows[0].id_client;
};

const addDevice = async (deviceData, clientConn) => {
  const { device_name, problem_description, device_status } = deviceData;
  const query = `
    INSERT INTO device (device_name, problem_description, device_status)
    VALUES ($1, $2, COALESCE($3, 'Not received'))
    RETURNING id_device
  `;
  const { rows } = await clientConn.query(query, [device_name, problem_description, device_status]);
  return rows[0].id_device;
};

// Updated to filter technicians by workshop
export const getLeastBusyTechnician = async (id_workshop) => {
  const query = `
    SELECT t.id_technicien
    FROM technicien t
    JOIN employs e ON t.id_technicien = e.id_technicien
    LEFT JOIN repair r 
      ON t.id_technicien = r.id_technicien 
     AND r.id_workshop = $1
    WHERE e.id_workshop = $1
    GROUP BY t.id_technicien
    ORDER BY COUNT(r.id_repair) ASC
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [id_workshop]);
  return rows[0]?.id_technicien || null;
};

export const addRepairRequest = async (data) => {
  const { client: clientData, device: deviceData, repair: repairData } = data;
  const clientConn = await pool.connect();
  try {
    await clientConn.query('BEGIN');
    const clientId    = await addClient(clientData, clientConn);
    const deviceId    = await addDevice(deviceData, clientConn);
    const trackingNum = generateTrackingNumber();
    
    // Pass workshop ID to fetch technician for that workshop
    const technicienId = await getLeastBusyTechnician(repairData.id_workshop);
    if (!technicienId) throw new Error("No technician available");

    const repairQuery = `
      INSERT INTO repair
        (id_client, id_device, id_workshop, id_technicien, created_at, tracking_number, repair_status)
      VALUES ($1, $2, $3, $4, NOW(), $5, COALESCE($6, 'Not Repaired'))
      RETURNING *
    `;
    const values = [
      clientId,
      deviceId,
      repairData.id_workshop,
      technicienId,
      trackingNum,
      repairData.repair_status
    ];
    const { rows } = await clientConn.query(repairQuery, values);
    await clientConn.query('COMMIT');
    return rows[0];
  } catch (err) {
    await clientConn.query('ROLLBACK');
    throw err;
  } finally {
    clientConn.release();
  }
};

export const getRepairDetailsById = async (id_repair) => {
  const query = `
    SELECT
      r.id_repair,
      r.tracking_number,
      r.repair_status,
      c.client_username,
      c.client_number,
      d.device_name,
      d.problem_description,
      r.created_at AS entry_date,
      f.cost
    FROM repair r
    JOIN client c ON r.id_client = c.id_client
    JOIN device d ON r.id_device = d.id_device
    -- pick the latest fix record (if any)
    LEFT JOIN (
      SELECT id_repair, cost
      FROM fix
      WHERE id_repair = $1
      ORDER BY fix_date DESC
      LIMIT 1
    ) f ON r.id_repair = f.id_repair
    WHERE r.id_repair = $1
  `;
  const { rows } = await pool.query(query, [id_repair]);
  return rows[0] || null;
};

export const getRepairsByWorkshop = async (id_workshop) => {
  const query = `
    SELECT
      r.id_repair,
      r.tracking_number,
      r.repair_status,
      c.client_username,
      c.client_number,
      d.device_name,
      d.problem_description,
      r.created_at AS entry_date
    FROM repair r
    JOIN client c ON r.id_client = c.id_client
    JOIN device d ON r.id_device = d.id_device
    WHERE r.id_workshop = $1
    ORDER BY r.created_at DESC
  `;
  const { rows } = await pool.query(query, [id_workshop]);
  return rows;
};

export const deleteRepair = async (id_repair) => {
  const { rows, rowCount } = await pool.query(
    `DELETE FROM repair WHERE id_repair = $1 RETURNING *`,
    [id_repair]
  );
  return rowCount > 0 ? rows[0] : null;
};

export const updateRepair = async (id_repair, data) => {
  const { repair_status, cost } = data; 

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    // 1) On récupère l'appareil et le technicien associés à la réparation
    const {
      rows: [old]
    } = await conn.query(
      `SELECT id_device, id_technicien
         FROM repair
        WHERE id_repair = $1`,
      [id_repair]
    );
    if (!old) throw new Error("Repair not found");

    // 2) On met à jour le statut de la réparation
    const {
      rows: [updated]
    } = await conn.query(
      `UPDATE repair
          SET repair_status = $1
        WHERE id_repair = $2
     RETURNING *`,
      [repair_status, id_repair]
    );

    // 3) Si on passe en "Repaired", on essaie d'abord d'UPDATE la table fix
    if (repair_status === "Repaired") {
      const { rowCount } = await conn.query(
        `UPDATE fix
            SET fix_date = NOW(),
                cost     = $4
          WHERE id_repair   = $1
            AND id_device   = $2
            AND id_technicien = $3`,
        [id_repair, old.id_device, old.id_technicien, cost || 0]
      );

      // 4) Si aucune ligne n'a été mise à jour, on INSERT
      if (rowCount === 0) {
        await conn.query(
          `INSERT INTO fix (id_repair, id_device, id_technicien, fix_date, cost)
           VALUES ($1, $2, $3, NOW(), $4)`,
          [id_repair, old.id_device, old.id_technicien, cost || 0]
        );
      }
    }

    await conn.query("COMMIT");
    return updated;

  } catch (err) {
    await conn.query("ROLLBACK");
    throw err;
  } finally {
    conn.release();
  }
};


export const getRepairById = async (id_repair) => {
  const query = `SELECT
      r.id_repair,
      r.tracking_number,
      r.repair_status,
      c.client_username,
      c.client_number,
      d.device_name,
      d.problem_description,
      r.created_at AS entry_date
    FROM repair r
    JOIN client c ON r.id_client = c.id_client
    JOIN device d ON r.id_device = d.id_device
    WHERE r.id_repair = $1
  `;
  const { rows } = await pool.query(query, [id_repair]);
  return rows[0] || null;
};

export const insertFix = async ({ id_repair, id_device, id_technicien, cost }) => {
  const query = `
    INSERT INTO fix (id_repair, id_device, id_technicien, fix_date, cost)
    VALUES ($1, $2, $3, NOW(), $4)
  `;
  await pool.query(query, [id_repair, id_device, id_technicien, cost]);
};

export const getRepairByTrackingNumber = async (tracking_number) => {
  const query = `
    SELECT
      r.id_repair,
      r.tracking_number,
      r.repair_status,
      c.client_username,
      c.client_number,
      d.device_name,
      d.problem_description,
      r.created_at AS entry_date
    FROM repair r
    JOIN client c ON r.id_client = c.id_client
    JOIN device d ON r.id_device = d.id_device
    WHERE r.tracking_number = $1
  `;
  const { rows } = await pool.query(query, [tracking_number]);
  return rows[0] || null;
};