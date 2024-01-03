const userModel = require("../../model/userModel");
const jobModel = require("../../model/jobModel");
const path = require("path");
const nodemailer = require('nodemailer');
const categoryModel = require('../../model/categorieModel')
const flash=require('connect-flash')


const jobList = async (req, res) => {
  try {
    const jobs = await jobModel.find();
    

    const sortedJobs = jobs.sort((a, b) => b.publishedOn - a.publishedOn);

    res.render("User/jobs/job_list", {
      title: "Job List Page",
      data: req.user,
      joblistdata: sortedJobs,
    });
  } catch (error) {
    console.log(error.message);
  }
};


const jobapply = (req, res) => {

  res.render("User/jobs/jobapply", {
    title: "job apply page",
    data: req.user,
  });
};

const jobDetail = async (req, res) => {

  try {
    const message=req.flash('message')
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).send("Could not find ID");
    }

    const job = await jobModel.findOne({
      _id: jobId,
      isActive: false,
    });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.render("User/jobs/job_detail", {
      title: "Job Details",
      data: req.user,
      job,
      message
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).redirect("/"); // Change the status code to 500 for internal server error
  }
};

const createJob = async (req, res) => {
  try {
    const image = req.file;
    const createdId = req?.user?.id; // Assuming your user ID is stored in req.user._id

    // Ensure that req.user contains the necessary information
    if (!req.user || !req.user.role || !createdId) {
      return res.status(400).json({ error: "Invalid user information" });
    }

    const job = new jobModel({
      companyimage: image.filename,
      jobTitle: req.body.jobTitle,
      location: req.body.location,
      employmentType: req.body.employmentType,
      salary: req.body.salary,
      jobDescription: req.body.jobDescription,
      responsibilities: req.body.responsibilities,
      qualifications: req.body.qualifications,
      publishedOn: req.body.publishedOn,
      vacancy: req.body.vacancy,
      jobNature: req.body.jobNature,
      deadline: req.body.deadline,
      createdId: createdId,
      companyName: req.body.companyName,
      companyDetails: req.body.companyDetails,
    });

    console.log(job);
    await job.save();
    return res.redirect("/employee");
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const applyJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Validate if userId and jobId are provided
    if (!userId || !jobId) {
      req.flash('error', 'User ID and Job ID are required');
      return res.status(400).json({ error: 'User ID and Job ID are required' });
    }

    const user = await userModel.findById(userId);
    const job = await jobModel.findById(jobId);

    // Validate if user and job exist
    if (!user || !job) {
      req.flash('error', 'User or Job not found');
      return res.status(404).json({ error: 'User or Job not found' });
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
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: 'Puspachandan Dasadhikari',
        to: user.email,
        subject: 'Job Application Confirmation',
        text: `Thank you for applying for the job (${job.jobTitle}). We will notify you with further details.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      // Set success flash message
      req.flash('message', 'You have successfully applied for this job. Please check your email for confirmation and further details.');
    }

    // Respond with success message
    res.json({ data: 'Application submitted successfully.' });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to submit the application.');
    return res.status(500).json({ error: 'Failed to submit the application.' });
  }
};

const getJobsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const jobs = await jobModel.find({ categories: category._id }).populate('categories').exec();

    // Render your view with the jobs data related to the category
    res.render('User/categories', {
      title: 'User categories',
      data: req.user,
      category: category,
      jobs:jobs
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  jobDetail,
  jobList,
  createJob,
  jobapply,
  applyJob,
  getJobsByCategory
};
