import UserModel from "../models/user.js";
import { body, validationResult } from "express-validator";
import * as userService from "../services/user.service.js";
import { createUser } from "../services/user.service.js";
import userModel from "../models/user.js";
import redis from "../services/redis.service.js";


export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser({ username, email, password });
    const token = user.generateToken();

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.loginUser({email,password})
        const token = user.generateToken(); 
        res.status(200).cookie("token", token).json({ user });

        
    } catch (error) {
        console.error("Login Error:", error);
        res.status(401).json({ error: "Internal Server Error" });
    }
};

// export const logoutUserController = async (req, res) => {
//     // try {
//     //     res.clearCookie("token");
//     //     res.status(200).json({ message: "Logout successful" });
//     // } catch (error) {
//     //     console.error("Logout Error:", error);
//     //     res.status(500).json({ error: "Internal Server Error" });
//     // }
   
 
//     const tokenData = req.tokenData;

//     if (!tokenData || !tokenData.exp || !tokenData._id) return;
  
//     const timeRemainingForToken = tokenData.exp * 1000 - Date.now();
//     const expiryInSeconds = Math.floor(timeRemainingForToken / 1000);
  
//     if (isNaN(expiryInSeconds) || expiryInSeconds <= 0) return;
  
//     await redis.set(`blacklist:${tokenData._id}`, "true", "EX", expiryInSeconds);
//     res.clearCookie("token");
//     res.status(200).json({ message: "Logout successful" });
// }

export const logoutUserController = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now();
  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }
  await redis.set(
    `blacklist:${token}`,
    true,
    "EX",
    Math.floor(timeRemainingForToken / 1000) || 3600
  );


  return res.status(200).json({ message: "User logged out successfully" });
};
