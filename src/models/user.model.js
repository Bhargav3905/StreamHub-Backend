import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// using pre middleware & bcrypt save the password with encryption when only the password field changes
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// using bcrypt compare password and hashed password to know authentic user
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// using jwt, access token generation
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    // 1 - payload
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    // 2 -secret key
    process.env.ACCESS_TOKEN_SECRET,
    // 3 - due time
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// using jwt, refresh token generation
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    // 1 - payload
    {
      _id: this._id,
    },
    // 2 -secret key
    process.env.REFRESH_TOKEN_SECRET,
    // 3 - due time
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
