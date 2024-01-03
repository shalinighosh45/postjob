const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    companyimage: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
        required: true,
      },
    ],
    qualifications: [
      {
        type: String,
        required: true,
      },
    ],
    publishedOn: {
      type: Date,
      required: true,
    },
    vacancy: {
      type: Number,
      required: true,
    },
    jobNature: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, default: false },
    adminId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required:true
    },
    applyIds: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyDetails: {
      type: String,
      required: true,
    },
    // categories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category", // Assuming your categories model is named 'Category'
    //   },
    // ],
    categories: [
      {
        type: String,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);
const jobModel = mongoose.model("Job", jobSchema);
module.exports = jobModel;
