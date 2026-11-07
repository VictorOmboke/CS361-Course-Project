import { Router } from "express";
import WatchlistController from "../controllers/watchlist-controller.js";
import { authenticateToken } from "../middleware/auth.js";

// Initialize express router
const router = Router();

// Routes
router.post("/", authenticateToken, WatchlistController.addToWatchlist);
router.get("/", authenticateToken, WatchlistController.getWatchlist);

router.get(
  "/media_item/:id",
  authenticateToken,
  WatchlistController.getWatchlistItemDetails
);

router.patch(
  "/item/:id",
  authenticateToken,
  WatchlistController.updateWatchState
);
router.delete(
  "/item/:id",
  authenticateToken,
  WatchlistController.deleteWatchlistItem
);
export default router;
