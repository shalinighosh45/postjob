const userModel = require("../../model/userModel");
const jobModel = require("../../model/jobModel");
const path = require("path");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const categoryModel = require('../../model/categorieModel')


const jobList = async (req, res) => {
  try {
    const job = await jobModel.find();
    res.render("Employee/jobs/job_list", {
      title: "job list page",
      data: req.employee,
      joblistdata: job,
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
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).send("Could not find ID");
    }

    const job = await jobModel.findOne({
      _id: jobId,
      isActive: false, //for admin active and inactive
    });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.render("Employee/jobs/job_detail", {
      title: "Job Details",
      data: req.employee,
      job,
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).redirect("/"); // Change the status code to 500 for internal server error
  }
};


const jobpost =async (req, res) => {
  try {
    const catgory=await categoryModel.find()
    res.render("Employee/jobpost", {
      title: "jobpost Page",
      data: req.employee,
      categorydata:catgory

    });
  } catch (error) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }  
};



const createJob = async (req, res) => {
  try {
    const image = req.file;
    const createdId = req?.employee?.id; // Assuming your user ID is stored in req.user._id

    // Ensure that req.user contains the necessary information
    if (!req.employee || !req.employee.role || !createdId) {
      return res.status(400).json({ error: "Invalid user information" });
    }

    
   //console.log('xyz');
    //categories
    //const categoryIds = req.body.categories.split(',').map(cat => mongoose.Types.ObjectId(cat.trim()));
    //console.log(categoryIds);


    //using name
    const categoryNames = req.body.categories.split(',').map(cat => cat.trim());
    const categoryObjects = await categoryModel.find({ title: { $in: categoryNames } });

    if (categoryObjects.length !== categoryNames.length) {
      return res.status(400).json({ error: "One or more categories not found" });
    }

    const categoryIds = categoryObjects.map(cat => cat._id);

    const options = { day: '2-digit', month: 'short', year: 'numeric' };

    const job = new jobModel({
      companyimage: image.filename,
      jobTitle: req.body.jobTitle,
      location: req.body.location,
      employmentType: req.body.employmentType,
      salary: req.body.salary,
      jobDescription: req.body.jobDescription,
      responsibilities: req.body.responsibilities,
      qualifications: req.body.qualifications,
      publishedOn: new Date(req.body.publishedOn).toLocaleDateString('en-US', options),
      vacancy: req.body.vacancy,
      jobNature: req.body.jobNature,
      deadline: new Date(req.body.deadline).toLocaleDateString('en-US', options),
      createdId: createdId,
      companyName: req.body.companyName,
      companyDetails: req.body.companyDetails,
      categories: categoryIds,
      // categories: categoryIds,
    });

    console.log(job);
    await job.save();

    await job.populate('categories')
    return res.redirect("/employee/dashboard");
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// const applyJob = async (req, res) => {
//   try {
//     const { userId, jobId } = req.body;

//     // Validate if userId and jobId are provided
//     if (!userId || !jobId) {
//       return res.status(400).json({ error: "User ID and Job ID are required" });
//     }

//     const user = await userModel.findById(userId);
//     const job = await jobModel.findById(jobId);

//     // Validate if user and job exist
//     if (!user || !job) {
//       return res.status(404).json({ error: "User or Job not found" });
//     }

//     // Check if the user is already associated with the job
//     if (!user.jobIds.includes(jobId)) {
//       await userModel.findByIdAndUpdate(user._id, {
//         $push: { jobIds: jobId },
//       });
//     }

//     // Check if the user has already applied for the job
//     if (!job.applyIds.includes(user._id.toString())) {
//       await jobModel.findByIdAndUpdate(job._id, {
//         $push: { applyIds: user._id },
//       });
//     }

//     // Respond with success message
//     return res.json({ data: "Application submitted successfully." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to submit the application." });
//   }
// };



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
      await userModel.findByIdAndUpdate(user._id, {
        $push: { jobIds: jobId },
      });
    }

    // Check if the user has already applied for the job
    if (!job.applyIds.includes(user._id.toString())) {
      await jobModel.findByIdAndUpdate(job._id, {
        $push: { applyIds: user._id },
      });
    }

    // Respond with success message
    const successMessage = "Application submitted successfully.";
    res.json({ data: successMessage });

    // Send email notification to the user
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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
      to: user.email, // Assuming the user object has an 'email' field
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

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit the application." });
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
    res.render('Employee/categories', {
      title: 'employee categories',
      data: req.employee,
      category: category,
      jobs:jobs
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const switchJob = async(req,res)=>{
  try{
    if(!req.params.id){
      console.log('id is missing');
    }

    const user = await jobModel.findById(req.params.id);

    if(!user){
      console.log('user not found');
    }

    user.isActive = !user.isActive;

    await user.save();
    return res.redirect('/employee/dashboard')

  }catch(err){
    console.log(err.message);
  }

}


module.exports = {
  jobDetail,
  jobList,
  jobpost,
  createJob,
  jobapply,
  applyJob,
  getJobsByCategory,
  switchJob
};
