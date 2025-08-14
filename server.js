import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import dbConnection from "./utils/db.js";

dotenv.config();
const app = express();
dbConnection();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);

app.listen(port, () => console.log(`app is running at port ${port}`));
