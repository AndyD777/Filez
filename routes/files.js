// routes/files.js
import express from "express";
import { getAllFiles } from "../db/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const files = await getAllFiles();
    res.json(files);
  } catch (err) {
    next(err);
  }
});

export default router;
