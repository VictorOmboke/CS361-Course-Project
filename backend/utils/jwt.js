import jwt from "jsonwebtoken";

// Short term access
export function generateAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

// Long term refresh
export function generateRefreshToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
