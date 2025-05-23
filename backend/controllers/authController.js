import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAllWilayas, getCommunesByWilaya } from "algerian-geo";
import { createWorkshop, findWorkshopByEmail } from "../models/authModel.js";

const SECRET_KEY = process.env.SECRET_KEY;

export const registerWorkshop = async (req, res) => {
  const { 
    workshop_name, 
    workshop_adresse, 
    workshop_number, 
    repair_specialisation, 
    workshop_gmail, 
    workshop_password,
    wilaya, 
    commune 
  } = req.body;

  if (!wilaya || typeof wilaya !== "string") {
    return res.status(400).json({ error: "Wilaya must be provided as a string" });
  }
  if (!commune || typeof commune !== "string") {
    return res.status(400).json({ error: "Commune must be provided as a string" });
  }
  if (!workshop_password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workshop_gmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const allWilayas = getAllWilayas();
    let wilayaData;
    const codeAsNumber = parseInt(wilaya, 10);
    if (!isNaN(codeAsNumber)) {
      wilayaData = allWilayas.find(w => w.code === codeAsNumber);
    } else {
      wilayaData = allWilayas.find(
        w => (w.name || "").toLowerCase() === wilaya.trim().toLowerCase()
      );
    }

    if (!wilayaData) {
      return res.status(400).json({ error: "Invalid Wilaya" });
    }

    const allCommunes = getCommunesByWilaya(wilayaData.code);
    let validCommune;
    const communeCode = parseInt(commune, 10);
    if (!isNaN(communeCode)) {
      validCommune = allCommunes.some(c => c.code === communeCode);
    } else {
      validCommune = allCommunes.some(
        c => (c.name || "").toLowerCase() === commune.trim().toLowerCase()
      );
    }

    if (!validCommune) {
      return res.status(400).json({ error: "Invalid Commune" });
    }

    const existingWorkshop = await findWorkshopByEmail(workshop_gmail);
    if (existingWorkshop) {
      return res.status(400).json({ error: "Workshop already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(workshop_password, salt);

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

    const token = jwt.sign(
      { id: newWorkshop.id_workshop, workshop_gmail: newWorkshop.workshop_gmail },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    req.session.token = token;
    req.session.user = {
      id_workshop: newWorkshop.id_workshop,
      workshop_gmail: newWorkshop.workshop_gmail
    };
    

    req.session.save(err => {
      if (err) {
        console.error("Error saving session:", err);
      } else {
        console.log("Session saved successfully:", req.session);
      }
    });

    res.status(200).json({ 
      message: "Registration successful",
      workshop: newWorkshop, 
      token // ✅ أضف التوكن هنا
    });
  } catch (error) {
    console.error("Error registering workshop:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginWorkshop = async (req, res) => {
  const { workshop_gmail, password } = req.body;
  try {
    const existingWorkshop = await findWorkshopByEmail(workshop_gmail);
    if (!existingWorkshop) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingWorkshop.workshop_password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingWorkshop.id_workshop, workshop_gmail: existingWorkshop.workshop_gmail },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    req.session.token = token;
    req.session.user = {
      id_workshop: existingWorkshop.id_workshop,
      workshop_gmail: existingWorkshop.workshop_gmail
    };
    

    req.session.save(err => {
      if (err) {
        console.error("Error saving session:", err);
      } else {
        console.log("Session saved successfully:", req.session);
      }
    });

    res.status(200).json({ 
      message: "Login successful", 
      workshop: existingWorkshop, 
      token // ✅ أضف التوكن هنا
    });
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ error: "Login failed" });
  }
};
export const logoutWorkshop = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
}
export const checkSession = (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({
      loggedIn: true,
      user: req.session.user
    });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};
export default { registerWorkshop, loginWorkshop ,checkSession };
