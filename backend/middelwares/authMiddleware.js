import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;

  // نحاول نجيب التوكن من الجلسة أو من الهيدر
  if (req.session && req.session.token) {
    token = req.session.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
