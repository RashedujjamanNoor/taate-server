import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400).json({ message: "User already exist" });
    }

    const hashPass = bcrypt.hashSync(password, 10);

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
      res.status(400).json({ message: "User not exist please register first" });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      res.status(404).json({ message: "Invalid Credential" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export { register, login };
