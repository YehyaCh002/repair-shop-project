const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors()); // To allow cross-origin requests from the frontend
app.use(express.json()); // To parse JSON data from requests

let repairs = [
  { id: 1, name: "Screen Repair", description: "Fix cracked screen", cost: 100, status: "Pending" },
  { id: 2, name: "Battery Replacement", description: "Replace battery", cost: 50, status: "Completed" },
];

// GET /repairs endpoint to fetch repairs
app.get("/repairs", (req, res) => {
  res.json(repairs);
});

// POST /repairs endpoint to add new repair
app.post("/repairs", (req, res) => {
  const newRepair = req.body; // Get the new repair data from the request body
  newRepair.id = repairs.length + 1; // Assign a new ID based on current array length
  repairs.push(newRepair); // Add the new repair to the list
  res.status(201).json(newRepair); // Send the newly added repair back in the response
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 