import pool from '../config/db.js';

export const fetchFixedRepairs = async () => {
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
    ORDER BY r.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};
export const createFixAndReceive = async ({ id_repair, id_device, id_technicien, cost }) => {
  const conn = await pool.connect();
  try {
    await conn.query('BEGIN');
    // upsert fix record: insert or update existing
    await conn.query(
      `INSERT INTO fix (id_repair, id_device, id_technicien, fix_date, cost, received_date)
       VALUES ($1, $2, $3, NOW(), $4, NOW())
       ON CONFLICT (id_device, id_technicien)
       DO UPDATE SET fix_date = EXCLUDED.fix_date,
                     cost = EXCLUDED.cost,
                     received_date = EXCLUDED.received_date`
      , [id_repair, id_device, id_technicien, cost]
    );
    // update device status
    await conn.query(
      `UPDATE device
         SET device_status = 'Received'
       WHERE id_device = $1`,
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
