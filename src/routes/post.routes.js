import { Router } from "express";
import *as postcontroller from "../controllers/post.controller.js";
import { handlefileUpload ,validateComment} from "../middlewares/post.middleware.js";
import * as userMiddleware from "../middlewares/user.middleware.js";


const router = Router();

router.post("/create", userMiddleware.authuser, handlefileUpload,postcontroller.createpost);

router.get("/get-all",userMiddleware.authuser,postcontroller.findPost);

router.get('/get/:postId',userMiddleware.authuser,postcontroller.getPost);

router.patch("/like/:postId",userMiddleware.authuser,postcontroller.likepost);

router.patch("/remove-like/:postId", userMiddleware.authuser, postcontroller.removeLikepost);

router.post('/comment',userMiddleware.authuser,validateComment,postcontroller.commentOnPost);

export default router;


