import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    media: {
      type: Object,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Author is required"],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    comment:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

postSchema.statics.getAuthorPost = async function (authorId) {
  if (!authorId) throw new Error("AuthorId is required");
  return this.find({ author: authorId });
};

postSchema.methods.updateCaption = async function (caption) {
  this.caption = caption;
  await this.save();
  return this;
};

postSchema.statics.getRecentPost = async function (limit, skip = 0) {
  if (!limit) throw new Error("Limit is required");
  const posts = await this.find()
    .sort({ createdAt: -1 })
    .limit(limit > 10 ? 10 : limit)
    .skip(skip)
    .populate("author");

  return posts;
};

postSchema.statics.isValidPostId = async (postId) => {
  if (!postId) {
    throw new Error("Post is requied");
  }
  const isValidPostId = mongoose.Types.ObjectId.isValid(postId);
  return isValidPostId;
};

postSchema.methods.incrementLikesCount = async function () {
  this.likesCount += 1;
  this.markModified("likesCount");
  await this.save();
  return this;
};

postSchema.methods.decrementLikeCount = async function () {
  this.likesCount -= 1;
  await this.save();
  return this;
};

postSchema.methods.incrementComment = async (req, res, next) => {
  this.comment += 1;
  await this.save();
  return this;
};

postSchema.methods.decrementComment = async (req, res, next) => {
  this.comment -= 1;
  await this.save();
  return this;
};

const postModel = mongoose.model("Post", postSchema);

export default postModel;
