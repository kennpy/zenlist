import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  tasks: Array,
  placement: Number,
});

const listModel = mongoose.model("listModel", listSchema);

export default listModel;
