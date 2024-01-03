const userModel = require("../model/userModel");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.checkDuplicate = async (req, res, next) => {
  try {
    const username = await userModel.findOne({ name: req.body.name });
    const email = await userModel.findOne({ email: req.body.email });

    if (username) {
      req.flash("message", "username alreday exists");
      console.log("username alreday exists");
      return res.redirect("/user_reg");
    }

    if (email) {
      req.flash("message", "email already exists");
      console.log("email already exists");
      return res.redirect("/user_reg");
    }
    const password = req.body.password;
    const confirmpassword = req.body.confirmPassword;

    if (password !== confirmpassword) {
      req.flash("message", "password and confirmpassword are not matched");
      console.log("password and confirmpassword are not matched");
      return res.redirect("/user_reg");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message, "error while check dublicate");
  }
};
