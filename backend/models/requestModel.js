import pool from "../config/db.js";

export const getAllRequests = async () => {
  const result = await pool.query("SELECT * FROM repair_requests");
  return result.rows;
};
export const getRepairRequest = async (id) => {
  const result = await pool.query("SELECT * FROM repair_requests WHERE id = $1", [id]);
  return result.rows[0]; // ✅ Return the found request
};


export const addRequest = async (clientName, phone, device, problem, cost, entryDate) => {
  const result = await pool.query(
    "INSERT INTO repair_requests (client_name, phone_number, device_type, problem_description, cost, entry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [clientName, phone, device, problem, cost, entryDate]
  );
  return result.rows[0];
};

export const deleteRequest = async (id) => {
  const result = await pool.query("DELETE FROM repair_requests WHERE id = $1 RETURNING *", [id]);
  return result.rowCount > 0 ? result.rows[0] : null; // ✅ Return deleted row or null if not found
};

// Update a repair request by ID
export const updateRepairRequest = async (id, data) => {
  const {
    clientName,
    phone,
    device,
    problem,
    cost,
    entryDate,
    deliveryDate,
    status,
  } = data;

  try {
    const result = await pool.query(
      `UPDATE repair_requests 
       SET client_name = $1, phone_number = $2, device_type = $3, 
           problem_description = $4, cost = $5, entry_date = $6, 
           delivery_date = $7, status = $8
       WHERE id = $9
       RETURNING *;`,
      [clientName, phone, device, problem, cost, entryDate, deliveryDate, status, id]
    );

    return result.rows[0]; // Return updated repair request
  } catch (error) {
    throw error;
  }
};
