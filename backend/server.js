const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "AI Interview Coach API is running" });
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

async function startServer() {
  if (!mongoUri) {
    console.warn("MONGO_URI is missing. Starting server without database connection (dev mode).");
    app.listen(port, () => {
      console.log(`Server running on port ${port} (no DB)`);
    });
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas. Starting server without DB:", error.message || error);
    app.listen(port, () => {
      console.log(`Server running on port ${port} (DB unavailable)`);
    });
  }
}

startServer();
