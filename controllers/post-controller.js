import Task from "../models/task.js";
import DB from "../models/db.js";

export default class PostController {
    static addTask(req, res) {
        if (req.body.title) {
            const title = req.body.title;
            const completed = req.body.completed ? true : false;

            try {
                const task = new Task(title, completed);
                task.save();
                res.json(task.id);
            } catch (e) {
                res.status(400).json(e.message);
            }
        } else {
            res.status(400).json("Invalid request");
        }
    }

    static toggleTask(req, res) {
        if (req.body.id) {
            const task = Task.getTaskById(req.body.id);
            if (task) {
                task.completed = !task.completed;
                task.save();
                res.json(true);
            } else {
                res.status(404).json(404);
            }
        } else {
            res.status(400).json(400);
        }
    }

    static editTask(req, res) {
        if (req.body.id && req.body.title) {
            const task = Task.getTaskById(req.body.id);
            if (task) {
                try {
                    task.title = req.body.title;
                    task.save();
                    res.json(true);
                } catch (e) {
                    res.status(400).json(e.message);
                }
            } else {
                res.status(404).json("Task not found.");
            }
        } else {
            res.status(400).json("Invalid Request.");
        }
    }

    static deleteTask(req, res) {
        if (req.body.id) {
            try {
                if (DB.deleteTask(req.body.id)) {
                    res.json(true);
                } else {
                    res.status(404).json("Task not found.");
                }
            } catch (e) {
                res.status(500).json("Server error.");
            }
        } else {
            res.status(400).json("Invalid Request.");
        }
    }
}
