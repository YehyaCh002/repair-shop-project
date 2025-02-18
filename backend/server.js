import express from "express";
import cors from "cors";
import pool from "./db.js"; // PostgreSQL connection

const app = express();
app.use(cors()); // Allow React to fetch data
app.use(express.json()); // Parse JSON requests

// ✅ Get repair requests
app.get("/requests", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM repair_requests");
    res.json({ rows: result.rows }); // Always return { rows: [...] }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.post("/requests", async (req, res) => {
  try {
    const { clientName, phone, device, problem, cost, entryDate, deliveryDate } = req.body;

    if (!clientName || !phone || !device || !problem || !entryDate) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const result = await pool.query(
      "INSERT INTO repair_requests (client_name, phone_number, device_type, problem_description, cost, entry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [clientName, phone, device, problem, cost, entryDate]
    );

    res.status(201).json({ message: "Request added successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
