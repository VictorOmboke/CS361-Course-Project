import jwt from "jsonwebtoken";

// Short term access
export function generateAccessToken(userId) {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Long term refresh
export function generateRefreshToken(userId) {
  return jwt.sign({ user_id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
