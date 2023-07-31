import "dotenv/config";
import DB from "./db.js";
import Task from "./task.js";

const t1 = new Task("Learn CSS", false);
console.log(t1);

t1.title = "you broked my heart";
// t1.completed = true; 00
t1.save();
t1.save();
