
import { generateCaptionFromImage } from "../services/Ai.service.js";
import { uploadFile } from "../services/cloudStorage.service.js";
import postModel from "../models/post.model.js";
import likeModel from "../models/likes.model.js";
import commentModel from "../models/comment.model.js";





export const createpost = async (req, res, next) => {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer)
      return res.status(400).json({ error: "No file provided" });

    const [fileData, caption] = await Promise.all([
      uploadFile(imageBuffer),
      generateCaptionFromImage(imageBuffer, req.file.mimetype), 
    ]);

    const newPost = await postModel.create({
      caption,
      media: fileData,
      author: req.user._id,
    });

    res.status(201).json({ newPost });
  } catch (error) {
    console.error("Caption generation error:", error);
    next(error);
  }
};

export const likepost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const isValid = await postModel.isValidPostId(postId);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const isAlreadyLiked = await likeModel.findOne({
      post: postId,
      user: req.user._id,
    });

    if (isAlreadyLiked) {
      return res.status(400).json({ message: "Post is already liked" });
    }

    await likeModel.create({
      post: postId,
      user: req.user._id,
    });
    await post.incrementLikesCount();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const removeLikepost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    console.log("Received postId:", postId);

    if (!req.user || !req.user._id) {
      console.log("User not authenticated");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isValid = await postModel.isValidPostId(postId);
    console.log("Is valid postId:", isValid);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await postModel.findById(postId);
    console.log("Post found:", post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const deleted = await likeModel.findOneAndDelete({
      post: postId,
      user: req.user._id,
    });
    console.log("Deleted like doc:", deleted);

    if (!deleted) {
      return res.status(200).json({ message: "Post not liked yet" });
    }

    await post.decrementLikeCount();
    console.log("Like count decremented");

    return res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Error in removeLikepost:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findPost = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    const recentPost = await postModel.getRecentPost(limit, skip);
    res.status(200).json({
      post: recentPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postModel.isValidPostId(postId)) {
      return res.status(400).json({ message: "Invalid Post Id" });
    }

    const post = await postModel.findById(postId).populate("author");

    if (!post) {
      return res.status(404).json({
        message: "Post Not Found",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};



export const commentOnPost = async (req, res, next) => {
  try {
    const { post, text, parentComment } = req.body;

    const currentPost = await postModel.findById(post);
    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (parentComment) {
      const isParentCommentExists = await commentModel.findById(parentComment);
      if (!isParentCommentExists) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const newComment = await commentModel.create({
      post,
      user: req.user._id, 
      text,
      parentComment: parentComment || null,
    });

    await currentPost.incrementComment();

    res.status(201).json({
      comment: newComment,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("Internal Server Error");
  }
};
