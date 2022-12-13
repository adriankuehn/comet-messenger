const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    picture: { type: String, default: "" },
    describtion: { type: String, max: 50 },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
