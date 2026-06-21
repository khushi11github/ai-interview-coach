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
    console.error("MONGO_URI is missing. Add your MongoDB Atlas connection string to backend/.env.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB Atlas");

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
