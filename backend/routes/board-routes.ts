import express from "express";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  addTaskToColumn,
  getTasksInColumn,
  updateTaskInColumn,
  deleteTaskInColumn,
} from "../controllers/board-controller";

const router = express.Router();

router.get("/", getBoards);
router.get("/:id/columns/:id", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

// Нові маршрути для роботи з тасками
router.post("/:boardId/columns/:columnId/tasks", addTaskToColumn);
router.get("/:boardId/columns/:columnId/tasks", getTasksInColumn); // Route to get tasks in a column
router.put("/:boardId/columns/:columnId/tasks/:taskId", updateTaskInColumn); // Route to update a task
router.delete("/:boardId/columns/:columnId/tasks/:taskId", deleteTaskInColumn);

export default router;
