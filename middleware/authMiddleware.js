import jwt from "jsonwebtoken";
import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "No User Exist" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized Access" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error: error.message });
  }
};

export { isAdmin };
