import Task from "../models/task.js";
import { rootPath } from "../app.js";

export default class GetController {
    static homeController(req, res) {
        res.sendFile(rootPath + "/views/home.html");
    }

    static getAllTasks(req, res) {
        try {
            const tasks = Task.getAllTasks(true);
            res.json(tasks);
        } catch (e) {
            res.status(500).json("Internal Server Error");
        }
    }
}
