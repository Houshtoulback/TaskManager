import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import "dotenv/config";

import getRoutes from "./get-router.js";
import postRoutes from "./post-router.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(getRoutes);
app.use(postRoutes);

app.listen(3000);
