import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import TaskModel from "../models/taskModel.js";

const router = express.Router();

// GENERIC MIDDLEWARE
router.use(bodyParser.json());

// TASK SPECIFIC MIDDLEWARE

// get all tasks qnd send them
router.get("/", async (req, res) => {
  let allTasksInList = await TaskModel.find();
  console.log("All tasks : ", allTasksInList);
  allTasksInList = await TaskModel.find({ parentList: "test" }).exec();
  console.log("all tasks with parenList == 'test' . . .", allTasksInList);
  res.send(allTasksInList);
});

// add a task and send what was made
router.post("/", async (req, res) => {
  let body = req.body;
  console.log(body);
  // make the task and send it back if working
  const taskJustMade = await TaskModel.create(body);
  res.status(200).json(taskJustMade);
});

// delete a task and send id of task that was deleted
router.delete("/", async (req, res) => {
  console.log("deleting task with id ", req.body.id);
  const deletedTask = await TaskModel.findByIdAndDelete(req.body.id);
  console.log("deleted ", deletedTask);
  res.json({ id: deletedTask._id });
});

export default router;
