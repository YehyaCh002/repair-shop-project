import pool from '../config/db.js';
import crypto from "crypto";

export const generateTrackingNumber = () =>
  crypto.randomBytes(8).toString("hex");

const addClient = async (clientData, clientConn) => {
  const { client_username, client_number, client_email } = clientData;
  const query = `
    INSERT INTO client (client_username, client_number, client_email)
    VALUES ($1, $2, $3)
    RETURNING id_client
  `;
  const values = [client_username, client_number, client_email];
  const res = await clientConn.query(query, values);
  return res.rows[0].id_client;
};

const addDevice = async (deviceData, clientConn) => {
  const { device_name, problem_description, device_status } = deviceData;
  const query = `
    INSERT INTO device (device_name, problem_description, device_status)
    VALUES ($1, $2, COALESCE($3, 'Not received'))
    RETURNING id_device
  `;
  const values = [device_name, problem_description, device_status];
  const res = await clientConn.query(query, values);
  return res.rows[0].id_device;
};

export const getLeastBusyTechnician = async () => {
  const query = `
    SELECT t.id_technicien
    FROM technicien t
    LEFT JOIN repair r ON t.id_technicien = r.id_technicien
    GROUP BY t.id_technicien
    ORDER BY COUNT(r.id_repair) ASC
    LIMIT 1
  `;
  const { rows } = await pool.query(query);
  return rows[0]?.id_technicien || null;
};

export const addRepairRequest = async (data) => {
  const { client: clientData, device: deviceData, repair: repairData } = data;
  const clientConn = await pool.connect();

  try {
    await clientConn.query('BEGIN');

    const clientId = await addClient(clientData, clientConn);
    const deviceId = await addDevice(deviceData, clientConn);
    const trackingNumber = generateTrackingNumber();
    const technicienId = await getLeastBusyTechnician();

    if (!technicienId) throw new Error("No technician available to assign.");

    const repairQuery = `
      INSERT INTO repair
        (id_client, id_device, id_workshop, id_technicien, created_at, tracking_number, repair_status)
      VALUES ($1, $2, $3, $4, NOW(), $5, COALESCE($6, 'Not repaired'))
      RETURNING *
    `;
    const repairValues = [
      clientId,
      deviceId,
      repairData.id_workshop,
      technicienId,
      trackingNumber,
      repairData.repair_status
    ];
    const { rows } = await clientConn.query(repairQuery, repairValues);
    await clientConn.query('COMMIT');
    return rows[0];
  } catch (error) {
    await clientConn.query('ROLLBACK');
    throw error;
  } finally {
    clientConn.release();
  }
};

export const getRepairDetailsById = async (id_repair) => {
  const query = `
    SELECT
      r.id_repair, r.tracking_number, r.repair_status,
      c.client_username, c.client_number,
      d.device_name, d.problem_description,
      r.created_at AS entry_date
    FROM repair r
    JOIN client c ON r.id_client = c.id_client
    JOIN device d ON r.id_device = d.id_device
    WHERE r.id_repair = $1
  `;
  const { rows } = await pool.query(query, [id_repair]);
  return rows[0] || null;
};

export const deleteRepair = async (id_repair) => {
  const query = `DELETE FROM repair WHERE id_repair = $1 RETURNING *`;
  const values = [id_repair];
  const result = await pool.query(query, values);
  return result.rowCount > 0 ? result.rows[0] : null;
};
