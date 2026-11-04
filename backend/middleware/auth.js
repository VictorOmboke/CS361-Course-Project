import jwt from "jsonwebtoken";
import AppError from "./errorHandler.js";

// Authenticate a JWT token
export function authenticateToken(req, res, next) {
  // Store contents of the authorization key from request headers
  const authHeader = req.headers["authorization"];

  // Check if authHeader exists, if so, split the string to access the token
  const token = authHeader && authHeader.split(" ")[1]; // Short-circuit evaluation (&&)

  if (!token) {
    throw new AppError("Token missing. Please log in.", 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the payload data to request object
    req.user = decoded;

    // Request advances to the controller
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token.", 403);
  }
}
