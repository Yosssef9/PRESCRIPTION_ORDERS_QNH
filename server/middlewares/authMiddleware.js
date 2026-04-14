const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  console.log("authMiddleware token", token);
  try {
    const payload = jwt.verify(token, process.env.PORTAL_JWT_SECRET);
    req.user = {
      userCode: payload.userCode,
      userName: payload.userName,
      isAdmin: payload.isAdmin,
      role: payload.isAdmin ? "admin" : "user",
    };
    console.log("authMiddleware payload", payload);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports = authMiddleware;
