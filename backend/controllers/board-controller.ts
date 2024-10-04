import { Request, Response } from "express";
import Board from "../models/Board";
import mongoose from "mongoose";

export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання даних" });
  }
};

export const createBoard = async (req: any, res: any) => {
  const { name } = req.body;

  try {
    const newBoard = new Board({
      name,
      columns: [
        { title: "To Do", tasks: [] },
        { title: "In Progress", tasks: [] },
        { title: "Done", tasks: [] },
      ],
    });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: "Помилка створення борду" });
  }
};

export const updateBoard = async (req: any, res: any) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedBoard) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: "Помилка редагування борду" });
  }
};

export const deleteBoard = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const deletedBoard = await Board.findByIdAndDelete(id);
    if (!deletedBoard) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }
    res.status(200).json({ message: "Борд успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення борду" });
  }
};

export const addTaskToColumn = async (req: any, res: any) => {
  const { boardId, columnId } = req.params; // Extract parameters
  const { title, description } = req.body; // Extract task details

  try {
    // Log received parameters
    // console.log(`Received boardId: ${boardId}, columnId: ${columnId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Неправильний ID борду" });
    }

    // Create ObjectId from boardId
    const boardIdObj = new mongoose.Types.ObjectId(boardId);
    // console.log(`Searching for board with ID: ${boardIdObj}`);

    // Find the board by ID
    const board = await Board.findById(boardIdObj);
    // console.log("Board query result:", board);

    if (!board) {
      console.error(`Board not found with ID: ${boardId}`); // Log if board is not found
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    // Log the found board for further verification
    // console.log("Found board:", board);

    // Find the specified column within the board
    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      console.error(
        `Column not found with ID: ${columnId} in board ID: ${boardId}`
      );
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    // Create the new task and add it to the column
    const newTask = { title, description };
    column.tasks.push(newTask);
    await board.save(); // Save the updated board

    console.log("Added task:", newTask);

    res.status(201).json({ message: "Задача додана", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Помилка додавання задачі" });
  }
};

export const getTasksInColumn = async (req: any, res: any) => {
  const { boardId, columnId } = req.params;

  try {
    // Validate ObjectId
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

export const updateTaskInColumn = async (req: any, res: any) => {
  const { boardId, columnId, taskId } = req.params;
  const { title, description } = req.body;

  try {
    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId) ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду, колонки або задачі" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    const task = column.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    // Update the task's properties
    task.title = title || task.title;
    task.description = description || task.description;
    await board.save();

    res.status(200).json({ message: "Задача успішно оновлена", task });
  } catch (error) {
    res.status(500).json({ message: "Помилка редагування задачі" });
  }
};

export const deleteTaskInColumn = async (req: any, res: any) => {
  const { boardId, columnId, taskId } = req.params;

  try {
    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(columnId) ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return res
        .status(400)
        .json({ message: "Неправильний ID борду, колонки або задачі" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Борд не знайдено" });
    }

    const column = board.columns.find((col) => col._id.toString() === columnId);
    if (!column) {
      return res.status(404).json({ message: "Колонка не знайдена" });
    }

    const taskIndex = column.tasks.findIndex(
      (t) => t._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Задача не знайдена" });
    }

    // Remove the task from the column's tasks
    column.tasks.splice(taskIndex, 1);
    await board.save();

    res.status(200).json({ message: "Задача успішно видалена" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення задачі" });
  }
};
