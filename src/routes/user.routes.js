import express from "express";
import * as userConroller from "../controllers/user.controller.js";
import * as usermiddleware from "../middlewares/user.middleware.js";
const router = express.Router();

router.post(
  "/register",
  usermiddleware.registerUserValidation,
  userConroller.createUserController
);

router.post(
  "/login",
  usermiddleware.loginUserValidation,
  userConroller.loginUserController
);

router.get("/profile", usermiddleware.authuser, (req, res) => {    res.json(req.user);
  });

router.get("/logout", 
  usermiddleware.authuser,
  userConroller.logoutUserController);




export default router;
