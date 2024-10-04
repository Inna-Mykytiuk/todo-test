import express from "express";
import {
  addTaskToColumn,
  getTasksInColumn,
  updateTaskInColumn,
  deleteTaskInColumn,
} from "../controllers/board-controller";

const router = express.Router();

router.post("/:boardId/columns/:columnId/tasks", addTaskToColumn);
router.get("/:boardId/columns/:columnId/tasks", getTasksInColumn);
router.put("/:boardId/columns/:columnId/tasks/:taskId", updateTaskInColumn);
router.delete("/:boardId/columns/:columnId/tasks/:taskId", deleteTaskInColumn);

export default router;
