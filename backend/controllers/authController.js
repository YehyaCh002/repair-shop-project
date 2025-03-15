import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/clientModel.js";

const JWT_SECRET = process.env.JWT_SECRET;


export const register = async (req, res) => {
  const { username, client_password, client_number, client_email } = req.body;

  try {
    const userExists = await findUserByEmail(client_email);
    if (userExists) { // check if the user already exists
      return res.status(400).json({ message: "Email déjà utilisé !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(client_password, salt);

    // newUser is the inserted row (object), not an object with a `rows` array
    const newUser = await createUser(username, hashedPassword, client_number, client_email);
  
    const token = jwt.sign({ id: newUser.id_client }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Inscription réussie !", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
export const login = async (req, res) => {
  const { client_email, client_password } = req.body;

  try {
    const user = await findUserByEmail(client_email);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé !" });
    }
    
      const validPassword = await bcrypt.compare(client_password, user.client_password);
      if (!validPassword) {
        return res.status(400).json({ message: "Mot de passe incorrect !" });
      }
  
      const token = jwt.sign({ id: user.id_client }, JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "Connexion réussie !", token });
  
  }
    catch (error){
      console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
    }
    
  
};
