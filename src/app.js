import config from "./config/config.js";
import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import aiRoutes from "./routes/ai.routes.js"
import postsRoutes from "./routes/post.routes.js";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/ai",aiRoutes);
app.use("/posts", postsRoutes);

export default app;
