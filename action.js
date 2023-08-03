import fs from "fs";

import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { parse, stringify } from "csv/sync";

import DB from "./db.js";
import Task from "./task.js";

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class Action {
    static list() {
        const tasks = Task.getAllTasks(true);
        if (tasks.length) {
            console.table(tasks);
        } else {
            console.log(warn("There is not any task."));
        }
    }

    static async add() {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter task title:",
                validate: (value) => {
                    if (value.length < 3) {
                        return "The title must contain at least 3 letters.";
                    }
                    return true;
                },
            },
            {
                type: "confirm",
                name: "completed",
                message: "Is this task completed?",
                default: false,
            },
        ]);

        try {
            const task = new Task(answers.title, answers.completed);
            task.save();
            console.log(success("New task saved successfully."));
        } catch (e) {
            console.log(error(e.message));
        }
    }

    static async delete() {
        const tasks = Task.getAllTasks();
        const choices = [];

        for (let task of tasks) {
            choices.push(task.title);
        }

        const answer = await inquirer.prompt({
            type: "list",
            name: "title",
            message: "Select a task to delete:",
            choices,
        });

        const task = Task.getTaskByTitle(answer.title);

        try {
            DB.deleteTask(task.id);
            console.log(success("Selected task deleted successfully."));
        } catch (e) {
            console.log(error(e.message));
        }
    }

    static async deleteAll() {
        const answer = await inquirer.prompt({
            type: "confirm",
            name: "result",
            message: "Are you sure for delete all tasks?",
        });

        if (answer.result) {
            try {
                DB.resetDB();
                console.log(success("All tasks deleted successfully."));
            } catch (e) {
                console.log(error(e.message));
            }
        }
    }

    static async edit() {
        const tasks = Task.getAllTasks();
        const choices = [];

        for (let task of tasks) {
            choices.push(task.title);
        }

        const selectedTask = await inquirer.prompt({
            type: "list",
            name: "title",
            message: "Select a task to edit:",
            choices,
        });

        const task = Task.getTaskByTitle(selectedTask.title);

        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter task title: ",
                validate: (value) => {
                    if (value.length < 3) {
                        return "The title must contain at least 3 letters.";
                    }
                    return true;
                },
                default: task.title,
            },
            {
                type: "confirm",
                name: "completed",
                message: "Is this task completed?",
                default: false,
            },
        ]);

        try {
            DB.saveTask(answers.title, answers.completed, task.id);
            console.log(success("Selected task edited successfully."));
        } catch (e) {
            console.log(error(e.message));
        }
    }

    static async export() {
        const answer = await inquirer.prompt({
            type: "input",
            name: "filename",
            message: "Enter output filename:",
            validate: (value) => {
                if (!/^[\w .-]{1,50}$/.test(value)) {
                    return "Please enter a valid filename.";
                }
                return true;
            },
        });

        const tasks = Task.getAllTasks(true);
        const output = stringify(tasks, {
            header: true,
            cast: {
                boolean: (value, context) => {
                    return String(value);
                },
            },
        });

        try {
            fs.writeFileSync(answer.filename, output);
            console.log(success("Tasks exported successfully"));
        } catch (e) {
            console.log(error("Can not write to " + answer.filename));
        }
    }

    static async import() {
        const answer = await inquirer.prompt({
            type: "input",
            name: "filename",
            message: "Enter input filename:",
        });

        if (fs.existsSync(answer.filename)) {
            try {
                const input = fs.readFileSync(answer.filename);
                const data = parse(input, {
                    columns: true,
                    cast: (value, context) => {
                        if (context.column === "id") {
                            return Number(value);
                        } else if (context.column === "completed") {
                            return value.toLowerCase() === "true"
                                ? true
                                : false;
                        }
                        return value;
                    },
                });
                DB.insertBulkData(data);
                console.log(success("Data imported successfully."));
            } catch (e) {
                console.log(error(e.message));
            }
        } else {
            console.log(error("Specified file does not exists."));
        }
    }

    static async download() {
        const baseURL = process.env.BASE_URL;

        const answer = await inquirer.prompt({
            type: "input",
            name: "filename",
            message: "Enter filename to download:",
        });

        const config = {
            baseURL,
            url: answer.filename,
        };

        try {
            const response = await axios(config);
            const data = parse(response.data, {
                columns: true,
                cast: (value, context) => {
                    if (context.column === "id") {
                        return Number(value);
                    } else if (context.column === "completed") {
                        return value.toLowerCase() === "true" ? true : false;
                    }
                    return value;
                },
            });
            DB.insertBulkData(data);
            console.log(success("Data downloaded to database successfully."));
            console.table(data);
        } catch (e) {
            console.log(error(e.message));
        }
    }
}
