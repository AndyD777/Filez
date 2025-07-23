
import express from "express";
import {
  getAllFolders,
  getFolderById,
  createFileInFolder,
  folderExists,
} from "../db/queries.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const folders = await getAllFolders();
    res.json(folders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const folder = await getFolderById(id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/files", async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);

    if (!(await folderExists(folderId))) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (!req.body) {
      return res.status(400).json({ error: "Request body required" });
    }

    const { name, size } = req.body;

    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof size !== "number" ||
      size < 0
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const newFile = await createFileInFolder(folderId, { name, size });

    res.status(201).json(newFile);
  } catch (err) {
    next(err);
  }
});

export default router;
