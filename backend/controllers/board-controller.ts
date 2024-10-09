const BoardMain = require("../models/Board.ts");
const { Request, Response } = require("express");

const getBoards = async (req = Request, res = Response) => {
  try {
    const boards = await BoardMain.find();
    res.status(200).json(boards);
  } catch {
    res.status(500).json({ message: "Помилка отримання даних" });
  }
};

const createBoard = async (req = Request, res = Response) => {
  const { name } = req.body;

  try {
    const newBoard = new BoardMain({
      name,
      columns: [
        { title: "To Do", tasks: [] },
        { title: "In Progress", tasks: [] },
        { title: "Done", tasks: [] },
      ],
    });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch {
    res.status(500).json({ message: "Помилка створення борду" });
  }
};

const updateBoard = async (req = Request, res = Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedBoard = await BoardMain.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedBoard) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }
    res.status(200).json(updatedBoard);
  } catch {
    res.status(500).json({ message: "Помилка редагування борду" });
  }
};

const deleteBoard = async (req = Request, res = Response) => {
  const { id } = req.params;

  try {
    const deletedBoard = await BoardMain.findByIdAndDelete(id);
    if (!deletedBoard) {
      res.status(404).json({ message: "Борд не знайдено" });
      return;
    }
    res.status(200).json({ message: "Борд успішно видалено" });
  } catch {
    res.status(500).json({ message: "Помилка видалення борду" });
  }
};

module.exports = {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
