const { Request, Response } = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Board = require("../models/Board");

const addTaskToColumn = async (req = Request, res = Response) => {
  const { boardId, columnId } = req.params;
  const { title, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      res.status(400).json({ message: "Неправильний ID борду" });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    const newTask = { id: uuidv4(), title, description };
    column.tasks.push(newTask);
    await board.save();

    res.status(201).json({ message: "Задача додана", task: newTask });
  } catch {
    res.status(500).json({ message: "Помилка додавання задачі" });
  }
};

const getTasksInColumn = async (req = Request, res = Response) => {
  const { boardId, columnId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      res.status(400).json({
        message: "Неправильний ID борду або колонки",
      });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    res.status(200).json(column.tasks);
  } catch {
    res.status(500).json({ message: "Помилка отримання задач" });
  }
};
const deleteTaskInColumn = async (req = Request, res = Response) => {
  const { boardId, columnId, taskId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      res.status(400).json({
        message: "Неправильний ID борду або колонки",
      });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      res.status(404).json({ message: "Задача не знайдена" });
      return;
    }

    column.tasks.splice(taskIndex, 1);
    await board.save();

    res.status(200).json({ message: "Задача успішно видалена" });
  } catch {
    res.status(500).json({ message: "Помилка видалення задачі" });
  }
};

const updateTaskInColumn = async (req = Request, res = Response) => {
  const { boardId, columnId, taskId } = req.params;
  const { title, description } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      res.status(400).json({
        message: "Неправильний ID борду або колонки",
      });
      return;
    }

    const board = await Board.findOneAndUpdate(
      {
        _id: boardId,
        "columns._id": columnId,
        "columns.tasks.id": taskId,
      },
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
      res.status(404).json({ message: "Задача не знайдена" });
      return;
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);

    if (!column) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    const task = column.tasks.find((t) => t.id === taskId);

    if (!task) {
      res.status(404).json({ message: "Задача не знайдена" });
      return;
    }

    res.status(200).json({ message: "Задача успішно оновлена", task });
  } catch {
    res.status(500).json({ message: "Помилка редагування задачі" });
  }
};

const moveTask = async (req = Request, res = Response) => {
  const { boardId, sourceColumnId, destColumnId, taskId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }

    const sourceColumn = board.columns.find(
      (col) => col._id.toString() === sourceColumnId
    );
    const destColumn = board.columns.find(
      (col) => col._id.toString() === destColumnId
    );
    if (!sourceColumn || !destColumn) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    const taskIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex === -1) {
      res.status(404).json({ message: "Задача не знайдена" });
      return;
    }
    const [task] = sourceColumn.tasks.splice(taskIndex, 1);

    destColumn.tasks.push(task);

    await board.save();

    res.status(200).json({ message: "Задача переміщена" });
  } catch {
    res.status(500).json({ message: "Помилка переміщення задачі" });
  }
};

const moveTaskWithinColumn = async (req = Request, res = Response) => {
  const { boardId, columnId, taskId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      res.status(400).json({
        message: "Неправильний ID борду або колонки",
      });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      res.status(404).json({ message: "Колонка не знайдена" });
      return;
    }

    const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      res.status(404).json({ message: "Задача не знайдена" });
      return;
    }

    const targetIndex = parseInt(req.params.targetIndex, 10);

    if (isNaN(targetIndex)) {
      res.status(400).json({ message: "Неправильний індекс задачі" });
      return;
    }

    const [task] = column.tasks.splice(taskIndex, 1);
    column.tasks.splice(targetIndex, 0, task);

    await board.save();

    res.status(200).json({
      message: "Задача переміщена в межах колонки",
      task,
    });
  } catch {
    res.status(500).json({ message: "Помилка переміщення задачі" });
  }
};

module.exports = {
  addTaskToColumn,
  getTasksInColumn,
  deleteTaskInColumn,
  updateTaskInColumn,
  moveTask,
  moveTaskWithinColumn,
};
