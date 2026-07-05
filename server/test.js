import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected successfully!");
  process.exit(0);
} catch (err) {
  console.error("❌ Connection failed:");
  console.error(err);
  process.exit(1);
}