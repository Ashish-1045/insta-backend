import userModel from "../models/user.js";

export const createUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("All field is required [username,email,password]");
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  try {
    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      throw new Error("User already exists");
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = new userModel({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  delete user._doc.password;
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("invalid credential");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  delete user._doc.password;
  return user;
};
