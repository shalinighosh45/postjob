const userModel = require('../../../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



const adminLoginAPI = async (req, res) => {
  try {
    const data = await userModel.findOne({ email: req.body.email });

    if (data) {
      if (data.status === false) {
        if (data.admin === true) {
          const pwd = data.password;

          if (bcrypt.compareSync(req.body.password, pwd)) {
            const token = jwt.sign(
              {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
              },
              process.env.JWT_KEY,
              { expiresIn: "24h" }
            );

            // Assuming your API should return a token
            return res.status(200).json({ message: "Admin login successful", token: token, id:data._id,name:data.name,email:data.email,role:data.role });
          } else {
            return res.status(401).json({ error: "Password does not match" });
          }
        } else {
          return res.status(403).json({ error: "You are not an admin" });
        }
      } else {
        return res.status(403).json({ error: "Email not exist" });
      }
    } else {
      return res.status(404).json({ error: "Email not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const dashboardAPI = (req, res) => {
    
    const adminName = req.admin.name;
  
    res.status(200).json({ message: "Welcome Admin Dashboard", adminName: adminName });
};

const allUsersAPI = async (req, res) => {
    try {
      
      const users = await userModel.find({
        role: 'user',
        admin: { $ne: true } 
      });
  
      res.status(200).json({ 
        message:'All user Data fetch successfully',
        len:users.length,
        users: users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const allEmployeesAPI = async (req, res) => {
    try {
      
      const employees = await userModel.find({
        role: 'employee',
        admin: { $ne: true } 
      });
  
      res.status(200).json({
        message:'All employee Data Fetch Successfully',
        len:employees.length,
         employees: employees });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const switchStatusOfUserAPI = async (req, res) => {
    try {
      
      if (!req.params.id) {
        console.error("Parameter 'id' is missing.");
        throw new Error("Parameter 'id' is missing.");
      }
  
      
      const user = await userModel.findById(req.params.id);
  
      
      if (!user) {
        console.error("User not found.");
        throw new Error("User not found.");
      }
  
      
      user.isActive = !user.isActive;
  
      
      await user.save();
  
      
      return res.status(200).json({ message: "Success", user: user });
    } catch (error) {
      console.error(error);
  
      // Send an error message in the API response
      return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
  adminLoginAPI,
  dashboardAPI,
  allUsersAPI,
  allEmployeesAPI,
  switchStatusOfUserAPI

};
