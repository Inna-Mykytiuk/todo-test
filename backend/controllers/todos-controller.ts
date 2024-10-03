import { Request, Response } from "express";
import List from "../models/list";

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await List.find();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання даних" });
  }
};

export const createList = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    const newList = new List({ title, description });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Помилка створення списку" });
  }
};

export const updateList = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedList = await List.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: "Список не знайдено" });
    }
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Помилка редагування списку" });
  }
};

export const deleteList = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const deletedList = await List.findByIdAndDelete(id);
    if (!deletedList) {
      return res.status(404).json({ message: "Список не знайдено" });
    }
    res.status(200).json({ message: "Список успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення списку" });
  }
};
