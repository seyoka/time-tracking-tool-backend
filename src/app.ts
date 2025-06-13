import express from "express";
import logger from "morgan";
import * as path from "path";
import sessionRoutes from "./routes/sessionRoutes";
import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import cors from 'cors';

// Routes
import { index } from "./routes/index";
console.log('=== DEBUG INFO ===');
console.log('sessionRoutes:', sessionRoutes);
console.log('sessionRoutes type:', typeof sessionRoutes);
console.log('sessionRoutes is function:', typeof sessionRoutes === 'function');
// Create Express server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);
app.use(express.json());
app.use("/api", sessionRoutes);

app.use(errorNotFoundHandler);
app.use(errorHandler);
