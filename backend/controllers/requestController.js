import { getAllRequests,getRepairRequest, addRequest, updateRepairRequest,deleteRequest } from "../models/requestModel.js";

export const fetchRequests = async (req, res) => {
  try {
    const requests = await getAllRequests();
    res.json(requests); // ✅ Return the array directly
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
};

export const getOneRequest = async (req, res) => {
  console.log("Received request:", req.method, req.url); 
  console.log("req.params:", req.params); 

  const { id } = req.params;

  if (!id || isNaN(id)) {  // ✅ Ensure ID is a number
    return res.status(400).json({ message: "Invalid or missing ID parameter" });
  }

  try {
    const result = await getRepairRequest(parseInt(id)); // ✅ Convert to integer
    if (result.rows.length > 0) {
      res.json(result.rows[0]); 
    } else {
      res.status(404).json({ message: "Repair request not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const createRequest = async (req, res) => {
  try {
    const { clientName, phone, device, problem, cost, entryDate, deliveryDate } = req.body;

    if (!clientName || !phone || !device || !problem || !entryDate) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Convert cost to a number or NULL
    const finalCost = cost ? parseFloat(cost) : null;

    const newRequest = await addRequest(clientName, phone, device, problem, finalCost, entryDate, deliveryDate);
    
    res.status(201).json({ message: "Request added successfully", data: newRequest });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const deletedReq = await deleteRequest(id);

    if (!deletedReq || deletedReq.rowCount === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({ message: "Repair request deleted successfully" });
  } catch (err) {
    console.error("Request failed", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller function for updating a repair request
export const updateRepair = async (req, res) => {
  const { id } = req.params;
  const requestData = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const updatedRepair = await updateRepairRequest(id, requestData);

    if (!updatedRepair) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    res.json({ message: "Repair request updated successfully!", updatedRepair });
  } catch (error) {
    res.status(500).json({ message: "Error updating repair request", error: error.message });
  }
};
