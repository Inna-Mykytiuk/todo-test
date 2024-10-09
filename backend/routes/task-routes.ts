const expressTask = require("express");
const {
  addTaskToColumn,
  getTasksInColumn,
  updateTaskInColumn,
  deleteTaskInColumn,
  moveTask,
  moveTaskWithinColumn,
} = require("../controllers/task-controller");

const taskRouter = expressTask.Router();

taskRouter.post("/:boardId/columns/:columnId/tasks", addTaskToColumn);
taskRouter.get("/:boardId/columns/:columnId/tasks", getTasksInColumn);
taskRouter.put("/:boardId/columns/:columnId/tasks/:taskId", updateTaskInColumn);
taskRouter.delete(
  "/:boardId/columns/:columnId/tasks/:taskId",
  deleteTaskInColumn
);
taskRouter.put(
  "/:boardId/columns/:sourceColumnId/tasks/:taskId/move/:destColumnId",
  moveTask
);
taskRouter.put(
  "/:boardId/:columnId/tasks/:taskId/move/:targetIndex",
  moveTaskWithinColumn
);

module.exports = taskRouter;
