import mongoose from "mongoose";
import config from "../config/config.js";

export const connect = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      console.log("Mongoose connected ✅");
    })
    .catch((err) => {
      console.error("MongoDB connection error ❌:", err);
    });
};

export default connect;
