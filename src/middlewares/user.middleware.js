import { body } from "express-validator";
import redis from "../services/redis.service.js";
import userModel from "../models/user.js";


export const registerUserValidation = [
  body("username")
    .isString()
    .withMessage("username must be srting ")
    .isLength({ min: 3, max: 15 })
    .withMessage("username must be between 3 to 15 character ")
    .custom((value) => value === value.toLowerCase())
    .withMessage("username must be in lowercase"),

  body("email").isEmail().withMessage("enter a valid email"),

  body("password")
    .isString()
    .withMessage("password must be in string")
    .isLength({ min: 6 })
    .withMessage("password must be min 6 character"),
];
export const loginUserValidation = [
  body("email").isEmail().withMessage("enter a valid email"),

  body("password")
    .isString()
    .withMessage("password must be in string")
    .isLength({ min: 6 })
    .withMessage("password must be min 6 character"),
];

export const authuser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = userModel.verifyToken(token);

    let user = await redis.get(`user:${decoded._id}`);
    if(user){
      user= JSON.parse(user);
    }
    if (!user) {
      user = await userModel.findById(decoded._id);

      if (user) {
        delete user._doc.password;

        await redis.set(`user:${decoded._id}`, JSON.stringify(user));
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    req.user = user;
    req.tokenData = {token, decoded};
    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({});
  }
};
