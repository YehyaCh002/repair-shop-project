import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "yehya", // Make sure this user exists
  host: "localhost",          // If running locally
  database: "repair_shop",  // Ensure this database exists
  password: "Yahiayahiach@24",  // Ensure this password is correct
  port: 5432,                 // Default PostgreSQL port
});

export default pool;
