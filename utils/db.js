import mongoose from "mongoose";

const dbConnection = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected succesfully");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnection;
