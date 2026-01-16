const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Verified", "Unverified"],
      default: "Unverified",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
