import { model, Schema, Document } from "mongoose";

export interface ITool extends Document {
  name: string;
}

const ToolSchema: Schema = new Schema({
  name: { type: String, unique: true, required: true },
});

export default model<ITool>("Tool", ToolSchema);
