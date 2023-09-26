import express from "express";

import GetController from "../controllers/get-controller.js";

const router = express.Router();

router.get("/", GetController.homeController);

router.get("/get-all-tasks", GetController.getAllTasks);

export default router;
