const mongoose = require("mongoose");

//*******************************[UserSchema-Created]*****************************//
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      enum: ["Mr", "Mrs", "Miss"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      length: 10,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 15,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      pincode: {
        type: String,
        trim: true,
        length: 6,
      },
    },
  },
  { timestamps: true }
);
//************************[UserSchema-Connection Created]*************************//
module.exports = mongoose.model("User", userSchema);
