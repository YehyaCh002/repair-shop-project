import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllWilayas, getCommunesByWilaya } from "algerian-geo";
import { createWorkshop, findWorkshopByEmail } from "../models/authModel.js";

const SECRET_KEY = process.env.SECRET_KEY; // Ensure .env uses SECRET_KEY

export const registerWorkshop = async (req, res) => {
  const { 
    workshop_name, 
    workshop_adresse, 
    workshop_number, 
    repair_specialisation, 
    workshop_gmail, 
    workshop_password, // client must send this key!
    wilaya, 
    commune 
  } = req.body;

  // Validate input types
  if (!wilaya || typeof wilaya !== "string") {
    return res.status(400).json({ error: "Wilaya must be provided as a string" });
  }
  if (!commune || typeof commune !== "string") {
    return res.status(400).json({ error: "Commune must be provided as a string" });
  }
  if (!workshop_password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    // Validate Wilaya
    const allWilayas = getAllWilayas();
    console.log("All Wilayas:", allWilayas.map(w => w.name)); // Debug logging
    // Find the wilaya object that matches the input (ignoring case and extra spaces)
    const wilayaData = allWilayas.find(w => (w.name || "").toLowerCase() === wilaya.trim().toLowerCase());
    if (!wilayaData) {
      return res.status(400).json({ error: "Invalid Wilaya" });
    }

    console.log("All Communes for Wilaya", wilaya, ":", allCommunes.map(c => c.name)); // Debug logging
    const validCommune = allCommunes.some(c => (c.name || "").toLowerCase() === commune.trim().toLowerCase());
    if (!validCommune) {
      return res.status(400).json({ error: "Invalid Commune" });
    }

    // Check if the workshop already exists
    const existingWorkshop = await findWorkshopByEmail(workshop_gmail);
    if (existingWorkshop) {
      return res.status(400).json({ error: "Workshop already exists" });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(workshop_password, salt);

    // Create workshop
    const newWorkshop = await createWorkshop({ 
      workshop_name, 
      workshop_adresse, 
      workshop_number, 
      repair_specialisation, 
      workshop_gmail, 
      workshop_password: hashedPassword, 
      wilaya, 
      commune
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newWorkshop.id, workshop_gmail: newWorkshop.workshop_gmail },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "Workshop registered successfully", 
      workshop: newWorkshop, 
      token 
    });
  } catch (error) {
    console.error("Error registering workshop:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginWorkshop = async (req, res) => {
  const { workshop_gmail, password } = req.body;
  try {
    // Find workshop by email
    const existingWorkshop = await findWorkshopByEmail(workshop_gmail);
    if (!existingWorkshop) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password: note that in the database we saved it as workshop_password
    const isPasswordValid = await bcrypt.compare(password, existingWorkshop.workshop_password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingWorkshop.id, workshop_gmail: existingWorkshop.workshop_gmail },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Login successful", 
      workshop: existingWorkshop, 
      token 
    });
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export default { registerWorkshop, loginWorkshop };
