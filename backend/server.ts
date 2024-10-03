require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error: any) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({}));
app.use(express.json());

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
