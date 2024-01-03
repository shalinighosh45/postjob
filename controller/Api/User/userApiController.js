const userModel = require("../../../model/userModel");
const tokenModel = require('../../../model/tokenModel')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const crypto = require('crypto')


const bannermodel = require('../../../model/Home/banner')
const aboutmodel = require('../../../model/Home/about')
const jobModel= require('../../../model/jobModel')
const reviewmodel = require('../../../model/Home/review')
const categorymodel = require('../../../model/categorieModel')
const companymodel = require('../../../model/Home/company')



const createRegistration = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      role: req.body.role,
    });

    res.status(201).json({
      message: "Registration successful. You can now log in.",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error while registration: ${err.message}` });
  }
};

const confirmation = async (req, res) => {
  try {
    const token = await tokenModel.findOne({ token: req.params.token });
    if (!token) {
      return res.status(404).json({
        status: false,
        message: "Token may be expired or invalid",
      });
    }

    const user = await userModel.findOne({
      _id: token._userId,
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Could not find the user",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "User already verified",
      });
    } else {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        status: true,
        message: "Your account has been verified successfully",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Error during account verification",
    });
  }
};

// const userLoginPost = async (req, res) => {
//   try {
//     if (!req.body.email || !req.body.password) {
//       return res.status(400).json({
//         status: false,
//         message: "Could not find email and password",
//       });
//     }

//     const user = await userModel.findOne({
//       email: req.body.email.trim().toLowerCase(),
//     });

//     if (!user) {
//       return res.status(401).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     if (!user.status) {
//       return res.status(404).json({
//         status: false,
//         message: "Account is inactive",
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(404).json({
//         status: false,
//         message: "User not verified",
//       });
//     }

//     // if (!user.isActive) {
//     //   return res.status(404).json({
//     //     status: false,
//     //     message: 'User is inactive',
//     //   });
//     // }

//     const isPasswordValid = bcrypt.compareSync(
//       req.body.password,
//       user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(404).json({
//         status: false,
//         message: "Password not matched",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//       process.env.JWT_KEY,
//       { expiresIn: "5h" }
//     );

//     return res.status(200).json({
//       status: true,
//       message: "User login successful",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//       token: token,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

const userLoginPost = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: false,
        message: "Could not find email and password",
      });
    }

    const user = await userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    if (!user.status) {
      return res.status(404).json({
        status: false,
        message: "Account is inactive",
      });
    }

    if (!user.isVerified) {
      return res.status(404).json({
        status: false,
        message: "User not verified",
      });
    }

    if (user.role !== 'user') {
      return res.status(403).json({
        status: false,
        message: "Access forbidden. Only user are allowed to log in.",
      });
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(404).json({
        status: false,
        message: "Password not matched",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "5h" }
    );

    return res.status(200).json({
      status: true,
      message: "User login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const logout=(req,res)=>{
  res.clearCookie("userToken");
  res.status(200).json({
      status: 'success',
      message: "User Logout Successfully"
  });

}

const home = async (req, res) => {
  try {
    const banner = await bannermodel.find();
    const about = await aboutmodel.find();
    const job = await jobModel.find();
    const review = await reviewmodel.find();
    const category = await categorymodel.find();
    const company =await companymodel.find()

   // console.log(job);

    return res.status(200).json({
      data:req.user,
      bannerdata:banner,
      aboutdata:about,
      joblistdata:job,
      reviewdata:review,
      categorydata:category,
      companydata:company
    })

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status:false,
      message:'Internal server error'
    })
  }
};

const userdash = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and populate their applied jobs
    const userData = await userModel.findById(userId).populate('applyIds');

    if (!userData) {
      return res.status(401).json({
        status: false,
        message: 'Could not find the user data'
      });
    }

    const appliedJobs = userData.applyIds; // List of job IDs the user has applied for

    // Find details of the jobs the user has applied for
    const jobData = await jobModel.find({ _id: { $in: appliedJobs } });

    return res.status(200).json({
      status: true,
      message: 'Data fetched successfully',
      data: req.user,
      user: userData,
      jobs: jobData  
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Some internal error'
    });
  }
};

const appliedjobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId).populate('applyIds');

    if (!userData) {
      return res.status(200).json({
        status: 'error',
        message: 'Could not find the user data'
      });
    }

    const appliedJobs = userData.applyIds;

    const jobData = await jobModel.find({ _id: { $in: appliedJobs } });

    return res.status(200).json({
      status: 'success',
      message: 'Data fetched successfully',
      data: req.user,
      user: userData,
      jobs: jobData
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
};



module.exports = {
  createRegistration,
  confirmation,
  userLoginPost,
  logout,
  home,
  userdash,
  appliedjobs
 
};
