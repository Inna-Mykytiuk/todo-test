import express from "express";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/board-controller";

const router = express.Router();

router.get("/boards", getBoards);
router.post("/boards", createBoard);
router.put("/boards/:id", updateBoard);
router.delete("/boards/:id", deleteBoard);

export default router;
