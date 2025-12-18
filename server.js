const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (VERY IMPORTANT for Netlify)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Test route (browser check)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// =======================
// Schema & Model
// =======================
const projectSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  type: String,
  description: String,
  deadline: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", projectSchema);

// =======================
// Routes
// =======================

// POST project (FORM SUBMIT)
app.post("/api/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "Project submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit project" });
  }
});

// GET projects (testing)
app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// =======================
// Server
// =======================
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
