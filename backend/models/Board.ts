const mongo = require("mongoose");
const { Schema } = mongo;

const columnSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  tasks: { type: Array, default: [] },
});

const boardSchema = new Schema({
  name: { type: String, required: true },
  columns: [columnSchema],
});

module.exports = mongo.model("Board", boardSchema);
