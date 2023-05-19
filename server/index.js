import express from "express";
import mongoose from "mongoose";
import taskMiddleware from "./routes/task.js";
import homeMiddleware from "./routes/home.js";

/*
MongoDB with Mongoose ORM
 - json FORMAT

"Task" {
     $id: int (generic id),
     "user" : Users.$id --> LINK to User table
     $tasks: Array (tasks)
     "placement" : int -- how necessary it is (1-5 / Max Number of Lists)
      { "task":"get milk", "page" : "first","completed": boolean, "important" : boolean}, . . , . 
 }
*/

const PORT = 5500;
const MONGO_DB_URL_CONNECTION = "mongodb://127.0.0.1:27017/zenlist";

await mongoose.connect(MONGO_DB_URL_CONNECTION);

// CONFIGURE SERVER TO RESPOND / WORK
const app = express();
app.use("/tasks", taskMiddleware);
app.use("/", homeMiddleware);

app.listen(PORT, () => console.log(PORT));
