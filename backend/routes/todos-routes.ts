import express from "express";
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/todos-controller";

const router = express.Router();

router.get("/todos", getLists);

router.post("/todos", createList);

router.put("/todos/:id", updateList);

router.delete("/todos/:id", deleteList);

export default router;
