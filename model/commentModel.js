const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    body: { type: String, required: true },
    like: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.ObjectId, ref: "postModel", required: true },
    userName: { type: String, ref: "User.name" }
  },
  { timestamps: true }
);
 

module.exports=mongoose.model('commentModel',CommentSchema)
