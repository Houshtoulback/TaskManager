import express from "express";

import Task from "./task.js";

const router = express.Router();

router.post("/add-task", (req, res) => {
    if (req.body.title) {
        const title = req.body.title;
        const completed = req.body.completed ? true : false;

        try {
            const task = new Task(title, completed);
            task.save();
            res.redirect("/");
        } catch (e) {
            res.status(400).send(`<h1>${e.message}</h1>`);
        }
    } else {
        res.status(400).send("<h1>invalid request</h1>");
    }
});

export default router;
