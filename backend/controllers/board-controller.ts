import { Request, Response } from "express";
import Board from "../models/Board";

export const getBoards = async (req: Request, res: Response): Promise<void> => {
    try {
        const boards = await Board.find();
        res.status(200).json(boards);
    } catch {
        res.status(500).json({ message: "Помилка отримання даних" });
    }
};

export const createBoard = async (
    req: Request,
    res: Response
): Promise<void> => {
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
    } catch {
        res.status(500).json({ message: "Помилка створення борду" });
    }
};

export const updateBoard = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedBoard = await Board.findByIdAndUpdate(
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

export const deleteBoard = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedBoard = await Board.findByIdAndDelete(id);
        if (!deletedBoard) {
            res.status(404).json({ message: "Борд не знайдено" });
            return;
        }
        res.status(200).json({ message: "Борд успішно видалено" });
    } catch {
        res.status(500).json({ message: "Помилка видалення борду" });
    }
};
