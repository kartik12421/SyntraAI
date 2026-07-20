import mongoose from "mongoose";

const userScheme = new mongoose(
  {
    firebaseUid: {
      type: String,
      unique: true,
    },
    name: String,
    email: String,
    avatar: String,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userScheme);

export default User;
