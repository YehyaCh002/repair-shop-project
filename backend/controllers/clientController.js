import { getAllClients } from "../models/clientModel.js";

export const fetchClients = async (req , res)=>{
    try {
        const clients = await getAllClients();
        res.json(clients);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
}
export default fetchClients;