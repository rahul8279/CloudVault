import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import folderRouter from "./modules/folders/folder.routes.js";
import fileRouter from "./modules/files/file.routes.js";

const app = express();
app.use(helmet())
app.use(cors({origin :env.CLIENT_ORIGIN}))
app.use(express.json({limit : "1mb"}));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/files", fileRouter);
// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
// Handle application errors
app.use(errorHandler);

export default app;