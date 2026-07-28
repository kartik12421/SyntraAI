import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("db connected: agent");
  } catch (error) {
    console.error(`db connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
