import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import router from "./routes";
import { stream } from "~config/logger.config";
import { notFoundError, errorHandler } from "~middleware/index";

const app = express();

app.use(cors({
   methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
   origin: ["http://localhost:8080", "http://10.0.0.147:8080", "https://snipify.vercel.app"],
   credentials: true
}));

app.use(helmet());

app.use(morgan("dev", {
   stream,
   skip: (_req, res) => res.statusCode < 200 || res.statusCode >= 400
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

app.use(notFoundError);

app.use(errorHandler);

export default app;