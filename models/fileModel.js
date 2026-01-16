const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    originalName: String,
    path: String,
    mimetype: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("files", FileSchema);
