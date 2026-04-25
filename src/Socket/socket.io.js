import {Server, Socket} from "socket.io";
import UserModel from "../models/user.js";

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
    console.log(socket.user);
    console.log("User connected");
  });
}

export default initSocket ; 