
import app from "./src/app.js";
import http from "http";
import config from "./src/config/config.js";
import connectToDB from "./src/db/db.js";

// import { init } from "mongoose/models/user_model.js";
import initSocket from "./src/Socket/socket.io.js";

connectToDB()
const server = http.createServer(app)

initSocket(server)
const PORT = config.PORT

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });