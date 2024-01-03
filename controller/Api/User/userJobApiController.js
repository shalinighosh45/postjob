const userModel = require("../../../model/userModel");
const jobModel = require("../../../model/jobModel");
const path = require("path");
const nodemailer = require("nodemailer");
const categoryModel = require("../../../model/categorieModel");


const jobList = async (req, res) => {
  try {
    const jobs = await jobModel.find();

    const sortedJobs = jobs.sort((a, b) => b.publishedOn - a.publishedOn);

    return res.status(200).json({
      status: true,
      message: "joblist data fetched successfully",
      data: req.user,
      joblistdata: sortedJobs,
    });
  } catch (error) {
    console.error(error.message);
    // You might want to send an error response here, for example:
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const jobDetail = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        status: false,
        message: "Could not find ID",
      });
    }

    const job = await jobModel.findOne({
      _id: jobId,
      isActive: false,
    });

    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Job details data fetch successfully",
      data: req.user,
      job,
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({
      status: false,
      message: "Some internal error ",
    });
  }
};

const applyJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Validate if userId and jobId are provided
    if (!userId || !jobId) {
      return res.status(400).json({ error: "User ID and Job ID are required" });
    }

    const user = await userModel.findById(userId);
    const job = await jobModel.findById(jobId);

    // Validate if user and job exist
    if (!user || !job) {
      return res.status(404).json({ error: "User or Job not found" });
    }

    // Check if the user is already associated with the job
    if (!user.jobIds.includes(jobId)) {
      await userModel.findByIdAndUpdate(user.id, {
        $push: { jobIds: jobId },
      });
      await userModel.findByIdAndUpdate(user.id, {
        $push: { applyIds: jobId },
      });
    }

    // Check if the user has already applied for the job
    if (!job.applyIds.includes(user._id.toString())) {
      await jobModel.findByIdAndUpdate(job.id, {
        $push: { applyIds: user.id },
      });

      // Send email notification to the user
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: "Puspachandan Dasadhikari",
        to: user.email,
        subject: "Job Application Confirmation",
        text: `Thank you for applying for the job (${job.jobTitle}). We will notify you with further details.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      // Set success message
      return res
        .status(200)
        .json({
          message:
            "You have successfully applied for this job. Please check your email for confirmation and further details.",
        });
    }

    // Respond with success message
    return res
      .status(200)
      .json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit the application." });
  }
};

const getJobsByCategoryAPI = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const jobs = await jobModel.find({ categories: category._id }).populate('categories').exec();

    // Return JSON response with jobs data related to the category
   return res.status(200).json({
      title: 'User categories data fetch successfully',
      data: req.user,
      category: category,
      jobs: jobs
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  jobList,
  jobDetail,
  applyJob,
  getJobsByCategoryAPI
};
