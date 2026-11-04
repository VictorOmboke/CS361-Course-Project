import { Router } from "express";
import AuthController from "../controllers/auth-controller.js";
import { authenticateToken } from "../middleware/auth.js";

// Initialize express router
const router = Router();

// Public routes
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.userLogIn);
router.post("/refresh-token", AuthController.refreshTokenHandler);

// Protected routes
router.get("/profile/:id", authenticateToken, AuthController.findUserById);
router.patch("/profile/:id", authenticateToken, AuthController.updateUserNames);
router.patch(
  "/password/:id",
  authenticateToken,
  AuthController.updateUserPassword
);
router.delete("/user/:id", authenticateToken, AuthController.deleteUser);

export default router;
