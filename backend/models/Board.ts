import mongoose, { Schema, Document } from "mongoose";

const columnSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  tasks: { type: Array, default: [] },
});

const boardSchema = new Schema({
  name: { type: String, required: true },
  columns: [columnSchema],
});

export default mongoose.model("Board", boardSchema);
