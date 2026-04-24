import {Server, Socket} from "socket.io";

function initSocket(server) {
  console.log("Socket.io connected")

  const io = new Server(server);

  io.on("connection", (Socket)=>{
    console.log("User connected")
  })
}

export default initSocket ; 