import {Server, Socket} from "socket.io";
import UserModel from "../models/user.js";
import mongoose from "mongoose";
import messageModel from "../models/message.model.js";

function initSocket(server) {
  console.log("Socket.io connected")
  const io = new Server(server);

  try{
    io.use( async (socket, next) => {
      const token = socket.handshake.headers.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

       const decodedToken = UserModel.verifyToken(token);
       const user = await UserModel.findById(decodedToken._id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    });
  }
  catch(err){
    console.error("Error initializing Socket.io:", err);
  }

  io.on("connection", (socket) => {
    
    socket.join(socket.user._id.toString())

    socket.on("chat-messages",async(data)=>{
      try{
      const { receiver, text } = data;

      if(!receiver || !text || !text.trim() || !receiver.trim()){
        return;
      }

      const sender = socket.user;

      const isvalidReceiver = mongoose.Types.ObjectId.isValid(receiver);

      if (!isvalidReceiver) {
        return next(new Error("Invalid receiver ID"));
      }
       
      const counterPart = await UserModel.findById(receiver);

      if (!counterPart) {
        return next(new Error("Receiver not found"));
      }

      await messageModel.create({
        sender: sender._id,
        receiver: counterPart._id,
        text
      })

      io.to(receiver).emit("chat-messages",{
        sender,
        receiver: counterPart,
        text
      })
      }catch(err){
        console.error("Error handling chat-messages event:", err);
      }
    })
  
    socket.on("disconnect" ,()=>{
      socket.leave(socket.user._id.toString())
      console.log("user disconnected"); 
    })

    console.log("User connected");
  });
}

export default initSocket ; 