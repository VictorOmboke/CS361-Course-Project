import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import watchlistRoutes from "./routes/watchlist-routes.js";
import errorHandler from "./middleware/errorHandler.js";

// Create express application
const app = express();
const PORT = process.env.EXPRESS_PORT;

// Configure cors
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running successfully, press CTRL+C to exit.`);
});
