import { text } from "express";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text is required"],
    trim: true,
    minLength: [1, "Text must be at least 1 character"],
    maxLength: [1000, "Text must be at least 1000 character"],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Sender is required"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "receiver is required"],
  },
});

const messageModel = new mongoose.model("message",messageSchema)

export default messageModel;