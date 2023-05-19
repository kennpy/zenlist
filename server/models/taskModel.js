import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: String,
  //parentList: mongoose.SchemaTypes.ObjectId,
  parentList: String,
  depth: Number,
  isImportant: Boolean,
  completed: Boolean,
});

const taskModel = mongoose.model("taskModel", taskSchema);

export default taskModel;
