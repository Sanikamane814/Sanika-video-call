import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password" });
  }

  try {
    const user = await User.findOne({ username }); // ✅ Use findOne

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ Await bcrypt.compare

    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({ message: "Login successful", token });
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

// REGISTER
const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(httpStatus.FOUND).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

export { login, register };


