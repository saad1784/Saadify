import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false; // cache DB connection

export const connectDatabase = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  let DB_URI = "";
  if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
  if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  try {
    const con = await mongoose.connect(DB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

