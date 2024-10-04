import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import todosRoutes from "./routes/todos-routes";
import boardRoutes from "./routes/board-routes";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI as string) // Додаємо явний кастинг типу
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/todos", todosRoutes); // Route for todos
app.use("/api/boards", boardRoutes); // Route for boards

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
