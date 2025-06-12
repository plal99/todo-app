require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Task = require("./models/task");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

app.get("/", async (req, res) => {
  const tasks = await Task.find({});
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  res.render("index", { tasks, today });
});

app.post("/", async (req, res) => {
  const { newTask } = req.body;
  if (newTask.trim() !== "") {
    await new Task({ name: newTask, completed: false }).save();
  }
  res.redirect("/");
});

app.post("/toggle", async (req, res) => {
  const task = await Task.findById(req.body.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await Task.findByIdAndUpdate(req.body.id, { name: req.body.updatedTask });
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await Task.findByIdAndDelete(req.body.id);
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
