import express from "express";
import filesRouter from "./routes/files.js";
import foldersRouter from "./routes/folders.js";

const app = express();

app.use(express.json());

app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
