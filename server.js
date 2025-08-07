import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(port, (req, res) => console.log(`app is running at port ${port}`));
