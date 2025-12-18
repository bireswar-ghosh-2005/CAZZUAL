require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5050;

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =======================
   PROJECT SCHEMA
======================= */
const projectSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    title: String,
    type: String,
    description: String,
    deadline: String
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

/* =======================
   AUTH MIDDLEWARE (ADMIN)
======================= */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* =======================
   ROUTES
======================= */

/* 🔓 PUBLIC: Health check */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* 🔓 PUBLIC: Submit project */
app.post("/api/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project submitted" });
  } catch (err) {
    res.status(500).json({ error: "Submission failed" });
  }
});

/* 🔓 PUBLIC: View projects (optional – OK for testing) */
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

/* 🔐 ADMIN LOGIN */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* 🔐 ADMIN: View all projects */
app.get("/api/admin/projects", verifyToken, async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
