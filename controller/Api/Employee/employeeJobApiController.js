const userModel = require("../../../model/userModel");
const jobModel = require("../../../model/jobModel");
const path = require("path");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const categoryModel = require('../../../model/categorieModel')



const createJobAPI = async (req, res) => {
  try {
    const image = req.file;
    const createdId = req?.employee?.id;

    // Ensure that req.employee contains the necessary information
    if (!req.employee || !req.employee.role || !createdId) {
      return res.status(400).json({ error: "Invalid user information" });
    }

    // Categories
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
    });

    await job.save();

    await job.populate('categories');

    return res.status(200).json({ message: 'Job created successfully', job: job });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const switchJobAPI = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Job ID is missing" });
    }

    const job = await jobModel.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    job.isActive = !job.isActive;

    await job.save();

    return res.status(200).json({
      message: `Job ${job.isActive ? 'deactivated' : 'activated'} successfully`,
      job: job,
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports = {
  createJobAPI,
  switchJobAPI
};
