const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

/**
 * server.js
 * --------------------------------------------------
 * The actual entry point of the application (see "main" in package.json).
 * Responsibilities:
 *   1. Load environment variables
 *   2. Connect to MongoDB
 *   3. Start the Express server
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`EventSphere server running on port ${PORT}`);
  });
};

startServer();
