import User from "../models/User.js";
import bcrypt from "bcrypt";

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
  console.log("i am login");
};

export { register, login };
