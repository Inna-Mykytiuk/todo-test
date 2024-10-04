import mongoose, { Schema, Document } from "mongoose";

export interface Column {
  title: string;
  tasks: string[];
}

export interface Board extends Document {
  id: string;
  name: string;
  columns: Column[];
}

const columnSchema = new Schema({
  title: { type: String, required: true },
  tasks: [{ name: String }],
});

const boardSchema = new Schema<Board>({
  name: { type: String, required: true },
  columns: [columnSchema],
});

export default mongoose.model<Board>("Board", boardSchema);
