import express from "express";
import "dotenv/config";
import cors from "cors";

// Create express application
const app = express();
const PORT = process.env.EXPRESS_PORT;
app.use(cors());

// Routes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running successfully, press CTRL+C to exit.`);
});
