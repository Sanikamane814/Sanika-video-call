import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

// -------------------- LOGIN --------------------
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide username & password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or Password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e.message}` });
  }
};

// -------------------- REGISTER --------------------
const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    return res.status(httpStatus.CREATED).json({ message: "User Registered Successfully" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e.message}` });
  }
};

// -------------------- ADD TO ACTIVITY --------------------
const addToActivity = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Token" });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Added meeting to history" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e.message}` });
  }
};

// -------------------- GET ALL ACTIVITY --------------------
const getAllActivity = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Token" });
    }

    const meetings = await Meeting.find({ user_id: user.username }).sort({ date: -1 });
    res.status(httpStatus.OK).json(meetings);
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e.message}` });
  }
};

// ✅ Correct exports
export { login, register, addToActivity, getAllActivity };
