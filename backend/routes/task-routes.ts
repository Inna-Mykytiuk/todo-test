import express from "express";
import {
    addTaskToColumn,
    getTasksInColumn,
    updateTaskInColumn,
    deleteTaskInColumn,
    moveTask,
    moveTaskWithinColumn,
} from "../controllers/task-controller";

const router = express.Router();

router.post("/:boardId/columns/:columnId/tasks", addTaskToColumn);
router.get("/:boardId/columns/:columnId/tasks", getTasksInColumn);
router.put("/:boardId/columns/:columnId/tasks/:taskId", updateTaskInColumn);
router.delete("/:boardId/columns/:columnId/tasks/:taskId", deleteTaskInColumn);
router.put(
    "/:boardId/columns/:sourceColumnId/tasks/:taskId/move/:destColumnId",
    moveTask
);
router.put(
    "/:boardId/:columnId/tasks/:taskId/move/:targetIndex",
    moveTaskWithinColumn
);

export default router;
