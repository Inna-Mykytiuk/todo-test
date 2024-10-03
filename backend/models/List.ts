import mongoose, { Document, Schema } from "mongoose";

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model("List", listSchema);
