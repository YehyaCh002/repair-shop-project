import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant !" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next(); // Continuer vers la route suivante
  } catch (err) {
    res.status(400).json({ message: "Token invalide !" });
  }
};


