import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import "dotenv/config";

import getRoutes from "./routes/get-routes.js";
import postRoutes from "./routes/post-routes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use(getRoutes);
app.use(postRoutes);

app.listen(3000);

export { __dirname as rootPath };
