const userModel = require("../../../model/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jobModel = require("../../../model/jobModel");
const categorymodel = require("../../../model/categorieModel");


const empLoginAPI = async (req, res) => {
    try {
      // Find user by email
      const employee = await userModel.findOne({ email: req.body.email });
  
      // Check for employee existence
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Check for employee status
      if (!employee.status) {
        return res.status(403).json({ error: 'Account is inactive' });
      }
  
      // Check for employee verification
      if (!employee.isVerified) {
        return res.status(403).json({ error: 'Employee not verified' });
      }
  
      if (employee.role !== 'employee') {
        return res.status(403).json({ error: 'Only employees can login' });
      }
  
      // Check for employee activation
      if (!employee.isActive) {
        return res.status(403).json({ error: 'Employee is inactive' });
      }
  
      // If all checks pass, proceed with password validation
      const hashedPassword = employee.password;
      const isPasswordValid = bcrypt.compareSync(req.body.password, hashedPassword);
  
      if (isPasswordValid) {
        // Generate JWT token
        const token = jwt.sign(
          {
            id: employee._id,
            name: employee.name,
            role: employee.role,
            email: employee.email,
          },
          process.env.JWT_KEY,
          { expiresIn: '5h' }
        );
  
        // Set employee data in req.employee
        req.employee = {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        };
  
        // Return the token in the API response
        return res.status(200).json({
          message: 'Employee Login successful',
          token: token,
          employee: req.employee,
        });
      } else {
        // Invalid password
        return res.status(401).json({ error: 'Invalid password' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
};
  

const logoutAPI = (req, res) => {
    try {
      res.clearCookie("employeeToken");
  
      return res.status(200).json({
        status: true,
        message: "Logout successful",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
};

const employeeAPI = async (req, res) => {
    try {
      const creatorId = req.employee.id;
      const jobs = await jobModel.find({ createdId: creatorId });
  
      return res.status(200).json({
        title: "Employee Page",
        data: req.employee,
        jobdata: jobs,
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};
  
    
  
  

module.exports = {
  empLoginAPI,
  logoutAPI,
  employeeAPI
};
