import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPass,
    });

    await newUser.save();
    res.status(200).json({ message: "User created succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not exist please register first" });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      return res.status(403).json({ message: "Invalid Credential" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      maxAge: 86400000,
    });

    res.status(200).json({ message: "Login Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export { register, login };
