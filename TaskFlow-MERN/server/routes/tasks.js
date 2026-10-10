import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = Router();
const validStatuses = ["To Do", "In Progress", "Completed"];
const validPriorities = ["Low", "Medium", "High"];

function validId(id) {
  return mongoose.isValidObjectId(id);
}

router.get("/", async (req, res, next) => {
  try {
    const { search = "", status = "", priority = "" } = req.query;
    const filter = {};
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }
    if (status && validStatuses.includes(status)) filter.status = status;
    if (priority && validPriorities.includes(priority)) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Task title is required." });
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Priority must be Low, Medium, or High." });
    }
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status is invalid." });
    }
    const task = await Task.create({ title, description, priority, status, dueDate: dueDate || null });
    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
    const updates = {};
    for (const key of ["title", "description", "priority", "status", "dueDate"]) {
      if (key in req.body) updates[key] = key === "dueDate" && !req.body[key] ? null : req.body[key];
    }
    if ("title" in updates && !updates.title?.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }
    if (updates.priority && !validPriorities.includes(updates.priority)) {
      return res.status(400).json({ message: "Priority is invalid." });
    }
    if (updates.status && !validStatuses.includes(updates.status)) {
      return res.status(400).json({ message: "Status is invalid." });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
