import { Router } from "express";
import SearchController from "../controllers/search-controller.js";
import { authenticateToken } from "../middleware/auth.js";

// Initialize express router
const router = Router();

// Routes
router.get("/", authenticateToken, SearchController.searchTmdb);

export default router;
