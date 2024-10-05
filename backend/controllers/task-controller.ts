import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Board from "../models/Board";

// Add task to column
export const addTaskToColumn = async (req: any, res: any) => {
  const { boardId, columnId } = req.params;
  const { title, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Неправильний ID борду" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    const newTask = { id: uuidv4(), title, description };
    column.tasks.push(newTask);
    await board.save();

    res.status(201).json({ message: "Задача додана", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Помилка додавання задачі" });
  }
};

// Get tasks in a column
export const getTasksInColumn = async (req: any, res: any) => {
  // console.log(
  //   `Fetching tasks for Board ID: ${req.params.boardId}, Column ID: ${req.params.columnId}`
  // );
  const { boardId, columnId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду або колонки" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    res.status(200).json(column.tasks);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання задач" });
  }
};

// Delete task from a column
export const deleteTaskInColumn = async (req: any, res: any) => {
  const { boardId, columnId, taskId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду або колонки" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    column.tasks.splice(taskIndex, 1);
    await board.save();

    res.status(200).json({ message: "Задача успішно видалена" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення задачі" });
  }
};

// Update task in a column
// Update task in a column
export const updateTaskInColumn = async (req: any, res: any) => {
  const { boardId, columnId, taskId } = req.params;
  const { title, description } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду або колонки" });
    }

    const board = await Board.findOneAndUpdate(
      { _id: boardId, "columns._id": columnId, "columns.tasks.id": taskId },
      {
        $set: {
          "columns.$.tasks.$[task].title": title,
          "columns.$.tasks.$[task].description": description,
        },
      },
      {
        arrayFilters: [{ "task.id": taskId }],
        new: true,
      }
    );

    if (!board) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    // Знаходимо колонку
    const column = board.columns.find((col) => col._id.toString() === columnId);

    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    // Знаходимо задачу в колонці
    const task = column.tasks.find((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    res.status(200).json({ message: "Задача успішно оновлена", task });
  } catch (error) {
    res.status(500).json({ message: "Помилка редагування задачі" });
  }
};

export const moveTask = async (req: any, res: any) => {
  const { boardId, sourceColumnId, destColumnId, taskId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    // Find the source and destination columns
    const sourceColumn = board.columns.find(
      (col) => col._id.toString() === sourceColumnId
    );
    const destColumn = board.columns.find(
      (col) => col._id.toString() === destColumnId
    );
    if (!sourceColumn || !destColumn) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    // Find and remove the task from the source column
    const taskIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }
    const [task] = sourceColumn.tasks.splice(taskIndex, 1);

    // Add the task to the destination column
    destColumn.tasks.push(task);

    await board.save(); // Save the changes to the database

    res.status(200).json({ message: "Задача переміщена" });
  } catch (error) {
    res.status(500).json({ message: "Помилка переміщення задачі" });
  }
};

// Move task within a column
export const moveTaskWithinColumn = async (req: any, res: any) => {
  const { boardId, columnId, taskId, targetIndex } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду або колонки" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    const [task] = column.tasks.splice(taskIndex, 1); // Вилучаємо завдання з початкової позиції
    column.tasks.splice(targetIndex, 0, task); // Додаємо завдання на нову позицію

    await board.save();

    res
      .status(200)
      .json({ message: "Задача переміщена в межах колонки", task });
  } catch (error) {
    res.status(500).json({ message: "Помилка переміщення задачі" });
  }
};
