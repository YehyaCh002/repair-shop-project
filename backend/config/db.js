import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const pool = new pg.Pool({
  user: "yehya",
  host: "localhost",
  database: "repair_shop",
  password: "Yahiayahiach@24",  // 🔥 Test with hardcoded password
  port: 5432,
});

export default pool;
