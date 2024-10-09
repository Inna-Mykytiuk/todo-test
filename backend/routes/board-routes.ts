const expressBoard = require("express");
const {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/board-controller");

const boardRouter = expressBoard.Router();

boardRouter.get("/", getBoards);
boardRouter.get("/:id/columns/:id", getBoards);
boardRouter.post("/", createBoard);
boardRouter.put("/:id", updateBoard);
boardRouter.delete("/:id", deleteBoard);

module.exports = boardRouter;
