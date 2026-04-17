import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", 
      required: [true, "Post is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Should match your user model name
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
  }
);

const likeModel = mongoose.model("likes", likeSchema);

export default likeModel;
