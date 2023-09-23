import Task from "../model/task.js";

import { rootPath } from "../app.js";

export default class GetController {
    static homeController(req, res) {
        const tasks = Task.getAllTasks();
        res.sendFile(rootPath + "/view/home.html");
    }
}
