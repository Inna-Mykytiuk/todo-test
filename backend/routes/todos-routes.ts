import express from "express";
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/todos-controller";

const router = express.Router();

router.get("/lists", getLists);

router.post("/lists", createList);

router.put("/lists/:id", updateList);

router.delete("/lists/:id", deleteList);

export default router;
