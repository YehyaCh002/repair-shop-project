import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.Secret_key;

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.workshop = verified; // Store workshop details in request
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
    }
};
export default { verifyToken };