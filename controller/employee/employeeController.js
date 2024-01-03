const userModel = require("../../model/userModel");
//const tokenModel = require("../../model/tokenModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");

const bannermodel = require("../../model/Home/banner");
const aboutmodel = require("../../model/Home/about");
const jobModel = require("../../model/jobModel");
const reviewmodel = require("../../model/Home/review");
//const categorymodel = require("../../model/Home/category");
const categorymodel = require("../../model/categorieModel");

const home = async (req, res) => {
  try {
    const banner = await bannermodel.find();
    const about = await aboutmodel.find();
    const job = await jobModel.find();
    const review = await reviewmodel.find();
    const category = await categorymodel.find();

    res.render("Employee/home.ejs", {
      title: "home page",
      data: req.employee,
      bannerdata: banner,
      aboutdata: about,
      joblistdata: job,
      reviewdata: review,
      categorydata: category,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const employeeLoginPage = async (req, res) => {
  const message=req.flash('message')
  res.render("Employee/employeelogin", {
    title: "Employee login Page",
    data: req.employee,
    message
  });
};

const about = (req, res) => {
  res.render("Employee/about.ejs", {
    title: "about page",
    data: req.employee,
  });
};

const category = (req, res) => {
  res.render("Employee/pages/category", {
    title: "category page",
    data: req.employee,
  });
};

const testimonial = (req, res) => {
  res.render("Employee/pages/testimonial", {
    title: "Testimonial Page",
    data: req.employee,
  });
};

const notFound = (req, res) => {
  res.render("Employee/pages/404", {
    title: "Not Found Page",
    data: req.employee,
  });
};

const contact = (req, res) => {
  res.render("Employee/contact", {
    title: "Contact Page",
    data: req.employee,
  });
};





const emploginpost = async (req, res) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email: req.body.email });

    // Check for user existence
    if (!user) {
      console.log('User not found');
      return res.redirect('/employee/employeelogin');
    }

    // Check for user status
    if (!user.status) {
      console.log('Account is inactive');
      return res.redirect('/employee/employeelogin');
    }

    // Check for user verification
    if (!user.isVerified) 
    {
      console.log('User not verified');
      return res.redirect('/employee/employeelogin');
    }

    if (user.role !== 'employee') {
      req.flash('message','employee can login')
      return res.redirect('/employee/employeelogin')
    }

    // Check for user activation
    if (!user.isActive) {
      // Handle inactive user
      req.flash('message', 'You have successfully registered. Your account will be activated within 24 hours by our Admins. Please login after 24 hours.');
      console.log('User is inactive');
      return res.redirect('/employee/employeelogin');
    }

    // If all checks pass, proceed with password validation
    const hashedPassword = user.password;
    const isPasswordValid = bcrypt.compareSync(req.body.password, hashedPassword);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_KEY,
        { expiresIn: '5h' }
      );

      // Set user data in req.user
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Set token in cookie
      res.cookie('employeeToken', token);

      console.log(user);
      return res.redirect('/employee/dashboard');
    } else {
      // Invalid password
      return res.status(401).send('Invalid password');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};



const employee = async (req, res) => {
  try {
    const creatorId = req.employee.id;
    console.log('createdId',creatorId);

    //const job = await jobModel.find();
    const job = await jobModel.find({ createdId: creatorId });

    res.render("Employee/employeeDashboard", {
      title: "Employee Page",
      data: req.employee,
      jobdata: job,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

const Auth = (req, res, next) => {
  if (req.employee) {
    //console.log(req.employee);
    next();
  } else {
    console.log("Could not get the data");
    res.redirect("/employee/employeelogin"); // Redirect to the home page or login page
  }
};

const logout = (req, res) => {
  res.clearCookie("employeeToken");
  res.redirect("/employee/employeelogin");
};

module.exports = {
  home,
  about,
  category,
  testimonial,
  notFound,
  contact,
  employee,
  logout,
  employeeLoginPage,
  emploginpost,
  Auth,
};
