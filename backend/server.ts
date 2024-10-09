require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const boardRoutes = require("./routes/board-routes");
const taskRoutes = require("./routes/task-routes");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log({ message: "Server error" }));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/boards", taskRoutes);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
