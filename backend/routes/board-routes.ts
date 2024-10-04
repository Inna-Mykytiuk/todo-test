import express from "express";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/board-controller";

const router = express.Router();

router.get("/", getBoards);
router.get("/:id/columns/:id", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
