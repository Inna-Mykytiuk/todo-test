import mongoose, { Schema, Document } from "mongoose";

export interface IColumn {
  title: string;
  tasks: string[];
}

export interface IBoard extends Document {
  name: string;
  columns: IColumn[];
}

const ColumnSchema: Schema = new Schema({
  title: { type: String, required: true },
  tasks: { type: [String], default: [] }, 
});


const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    columns: { type: [ColumnSchema], default: [] },
  },
  { timestamps: true }
);


export default mongoose.model<IBoard>("Board", BoardSchema);
