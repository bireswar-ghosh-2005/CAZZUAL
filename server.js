require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  title: String,
  type: String,
  description: String,
  deadline: String,
  status: { type: String, default: "pending" }
});

const Project = mongoose.model("Project", ProjectSchema);

/* PUBLIC SUBMIT */
app.post("/api/projects", async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // DEBUG

  try {
    const project = new Project({
      name: req.body.name,
      email: req.body.email,
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      deadline: req.body.deadline
    });

    await project.save();
    res.json({ message: "Saved" });
  } catch (e) {
    console.error("SAVE ERROR:", e);
    res.status(500).json({ error: "Save failed" });
  }
});

/* ADMIN LOGIN */
app.post("/api/admin/login", (req, res) => {
  if (
    req.body.email !== process.env.ADMIN_EMAIL ||
    req.body.password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Invalid" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);
  res.json({ token });
});

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Bad token" });
  }
}

/* GET PROJECTS */
app.get("/api/admin/projects", auth, async (req, res) => {
  const projects = await Project.find().sort({ _id: -1 });
  res.json(projects);
});

/* ACCEPT */
app.post("/api/admin/projects/:id/accept", auth, async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "accepted" });
  res.json({ ok: true });
});

/* REJECT */
app.post("/api/admin/projects/:id/reject", auth, async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ ok: true });
});

app.listen(process.env.PORT || 5050, () =>
  console.log("Server running")
);
