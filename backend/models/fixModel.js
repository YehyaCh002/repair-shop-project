import pool from '../config/db.js';

export const fetchFixedRepairs = async (id_workshop) => {
  const query = `
    SELECT
      r.id_repair,
      r.id_client,
      r.id_device,
      r.id_technicien,
      c.client_username AS client,
      d.device_name       AS device,
      d.problem_description,
      f.received_date
    FROM repair r
    JOIN client c ON c.id_client  = r.id_client
    JOIN device d ON d.id_device  = r.id_device
    LEFT JOIN fix f ON f.id_repair = r.id_repair
    WHERE r.repair_status = 'Repaired'
      AND r.id_workshop = $1
    ORDER BY r.created_at DESC;
  `;

  const { rows } = await pool.query(query, [id_workshop]);
  return rows;
};

export const createFixAndReceive = async ({ id_repair, id_device, id_technicien, cost }) => {
  const conn = await pool.connect();
  try {
    await conn.query('BEGIN');

    // Upsert into fix table
    await conn.query(
      `INSERT INTO fix (
         id_repair,
         id_device,
         id_technicien,
         fix_date,
         cost,
         received_date
       )
       VALUES ($1, $2, $3, NOW(), $4, NOW())
       ON CONFLICT (id_repair)
       DO UPDATE SET
         id_device      = EXCLUDED.id_device,
         id_technicien  = EXCLUDED.id_technicien,
         fix_date       = EXCLUDED.fix_date,
         cost           = EXCLUDED.cost,
         received_date  = EXCLUDED.received_date;
      `,
      [id_repair, id_device, id_technicien, cost]
    );

    // Mark the repair as repaired
    await conn.query(
      `UPDATE repair
         SET repair_status = 'Repaired'
       WHERE id_repair = $1;
      `,
      [id_repair]
    );

    // Update device status
    await conn.query(
      `UPDATE device
         SET device_status = 'Received'
       WHERE id_device = $1;
      `,
      [id_device]
    );

    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};
