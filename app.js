import express from "express";
import path from "path";

import { fileURLToPath } from "url";
import "dotenv/config";

import getRoutes from "./get-router.js";
import postRoutes from "./post-router.js";
const app = express();

const _dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(_dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(getRoutes);
app.use(postRoutes);

app.listen(3000);
