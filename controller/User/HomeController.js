const userModel = require("../../model/userModel");
const tokenModel = require("../../model/tokenModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const mongoose = require('mongoose');

const bannermodel = require("../../model/Home/banner");
const aboutmodel = require("../../model/Home/about");
const jobModel = require("../../model/jobModel");
const reviewmodel = require("../../model/Home/review");
const categorymodel = require("../../model/Home/category");
const companymodel=require('../../model/Home/company')

const userlogin = (req, res) => {
  const message=req.flash('message')
  res.render("user/userlogin", {
    title: "user login page",
    data: req.user,
    message
  });
};

const user_registration = (req, res) => {
  res.render("user/userregistration", {
    title: "user registration page",
    data: req.user,
  });
};

const home = async (req, res) => {
  try {
    const banner = await bannermodel.find();
    const about = await aboutmodel.find();
    const job = await jobModel.find();
    const review = await reviewmodel.find();
    const category = await categorymodel.find();
    const company =await companymodel.find()

    console.log(job);
    
    res.render("User/home.ejs", {
      title: "home page",
      data: req.user,
      bannerdata: banner,
      aboutdata: about,
      joblistdata: job,
      reviewdata: review,
      categorydata: category,
      companydata:company
    });
  } catch (error) {
    console.log(error.message);
  }
};

const about =async (req, res) => {
  try{
    const about = await aboutmodel.find()
    res.render("User/about", {
      title: "about page",
      data: req.user,
      aboutdata:about
    });

  }catch(err){
    console.log(err);
  }
 
};

const category = (req, res) => {
  res.render("User/pages/category", {
    title: "category page",
    data: req.user,
  });
};

const testimonial = (req, res) => {
  res.render("User/pages/testimonial", {
    title: "Testimonial Page",
    data: req.user,
  });
};

const notFound = (req, res) => {
  res.render("User/pages/404", {
    title: "Not Found Page",
    data: req.user,
  });
};

const contact = (req, res) => {
  res.render("User/contact", {
    title: "Contact Page",
    data: req.user,
  });
};

const createRegistration = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    const user = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      role: req.body.role,
    });

    const tokenValue = await crypto.randomBytes(16).toString("hex");

    const token = await tokenModel.create({
      _userId: user._id,
      token: tokenValue,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: "Shuvam",
      to: user.email,
      subject: "Account Verification",
      text: `Hello ${user.name}, 
                    \n\nPlease click the link to verify your account:
                    \n\nhttp://${req.headers.host}/confirmation/${user.email}/${token.token}\n\nThank You!`,
    };

    await transporter.sendMail(mailOptions);

    req.flash(
      "message",
      "A verification link has been sent to your email. Please check, and it will expire within 24 hours."
    );
    console.log(
      "A verification link has been sent to your email. Please check, and it will expire within 24 hours."
    );
    return res.redirect("/userlogin");
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error while registration: ${err.message}`);
  }
};

const confirmation = async (req, res) => {
  try {
    const token = await tokenModel.findOne({ token: req.params.token });
    if (!token) {
      req.flash("message", "token may be expires");
      console.log("token may be expires");
      return res.redirect("/");
    }
    const user = await userModel.findOne({
      _id: token._userId,
      email: req.params.email,
    });
    if (user) {
      if (user.isVerified) {
        req.flash("message", "user already verified");
        console.log("user already verified");
        return res.redirect("/");
      } else {
        user.isVerified = true;
        await user.save();
        req.flash("message", "Your accound veried successfully");
        console.log("Your accound veried successfully");
        return res.redirect("/userlogin");
      }
    } else {
      req.flash("message", "cound not find the user");
      console.log("cound not find the user");
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error while registration: ${err.message}`);
  }
};

const appliedjobs=async(req,res)=>{
  try {
   
    const userId = req.user.id;

    // Find the user and populate their applied jobs
    const userData = await userModel.findById(userId).populate('applyIds');
    console.log('userData',userData);

    if (!userData) {
      return res.status(401).send('Could not find the user data');
    }

    const appliedJobs = userData.applyIds; // List of job IDs the user has applied for
    console.log('appliedJobs',appliedJobs);

    // Find details of the jobs the user has applied for
    const jobData = await jobModel.find({ _id: { $in: appliedJobs } });
    console.log('jobs',jobData);

    res.render("User/appliedjobs", {
      title: "User appliedjobs Page",
      data: req.user,
      user: userData,
      jobs: jobData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}


const userDash = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and populate their applied jobs
    const userData = await userModel.findById(userId).populate('applyIds');
    console.log('userData',userData);

    if (!userData) {
      return res.status(401).send('Could not find the user data');
    }

    const appliedJobs = userData.applyIds; // List of job IDs the user has applied for
    console.log('appliedJobs',appliedJobs);

    // Find details of the jobs the user has applied for
    const jobData = await jobModel.find({ _id: { $in: appliedJobs } });
    console.log('jobs',jobData);

    res.render("User/userDashboard", {
      title: "User Dashboard Page",
      data: req.user,
      user: userData,
      jobs: jobData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};


const userloginpost = async (req, res) => {
  try {
    // Ensure that email and password are present in the request body
    if (!req.body.email || !req.body.password) {
      req.flash('message', 'Email and password are required');
      return res.redirect('/userlogin');
    }

    const user = await userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
    });

    // Check for user existence
    if (!user) {
      req.flash('message', 'User not found');
      return res.redirect('/userlogin');
    }

    // Check for user status, verification, and activity
    if (!user.status) {
      req.flash('message', 'Account is inactive');
      return res.redirect('/userlogin');
    }

    if (!user.isVerified) {
      req.flash('message', 'User not verified');
      return res.redirect('/userlogin');
    }

    if (user.role !== 'user') {
      req.flash('message','Only user can login')
      return res.redirect('/userlogin')
    }

   
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      req.flash('message', 'Invalid password');
      return res.redirect('/userlogin');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: '5h' }
    );

    // Set user data in req.user
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // Set token in cookie
    res.cookie('userToken', token);

    // Redirect based on user's role
    return res.redirect('/');

  } catch (err) {
    console.error(err);
    req.flash('message', 'Internal server error');
    return res.status(500).send('Internal server error');
  }
};

const userAuth = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    next();
  } else {
    console.log("Could not get the data");
    res.redirect("/userlogin"); // Redirect to the home page or login page
  }
};

const logout = (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/");
};



module.exports = {
  home,
  about,
  category,
  testimonial,
  notFound,
  contact,
  userlogin,
  user_registration,
  createRegistration,
  confirmation,
  userloginpost,
  userDash,
  userAuth,
  logout,
  appliedjobs
};
