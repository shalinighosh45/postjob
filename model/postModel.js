const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {type: String,required:true},
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    adminId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    commentIds: {
      type: [mongoose.Schema.ObjectId],
      ref: "commentModel",
      default: [],
    },
    like: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports=mongoose.model('postModel',PostSchema)
