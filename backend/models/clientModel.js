import  pool  from "../config/db.js";

export const createUser = async (username, hashedPassword, client_number, client_email) => {
    const result = await pool.query(
        "INSERT INTO Client (username, client_password, client_number, client_email) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, hashedPassword, client_number, client_email]
    );
    return result.rows[0];
  };
  
  // Find user by email
  export const findUserByEmail = async (client_email) => {
    const result = await pool.query(
        "SELECT * FROM Client WHERE client_email = $1",
        [client_email]
    );
    return result.rows[0];
  };
  