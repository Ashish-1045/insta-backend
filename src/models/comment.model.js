import { text } from "express";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post',
    requied:true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true,
  },
  text:{
    type:String,
    requied:true,
  },
  parentComment:{
    type:mongoose.Schema.Types.ObjectId,
   ref:'comment'
  }
})

const commentModel = mongoose.model('comment',commentSchema);

export default commentModel;