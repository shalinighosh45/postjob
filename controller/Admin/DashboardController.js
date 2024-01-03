const userModel = require('../../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')





const allEmployee = async (req, res) => {
  try {
    // Modify the query to fetch only users with the role "employee" and exclude those with "admin" role
    const users = await userModel.find({
      role: 'employee',
      admin: { $ne: true } // Exclude users with admin set to true
    });

    res.render('Admin/allEmployee/index', {
      title: 'All Employees',
      admin: req.admin,
      users,
      url: req.url
    });
  } catch (err) {
    console.log(err);
    // Handle the error, e.g., send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const dashboard = (req, res) => {
  res.render("Admin/admindashboard", {
    title: "dashboard",
    admin:req.admin
  });
};
const login = (req, res) => {
  res.render("Admin/adminlogin", {
    title: "dashboard",
    admin:req.admin
  });
};

const adminloginpost = async (req, res) => {
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

            res.cookie("adminToken", token);
            res.redirect("/admin/dashboard");
          } else {
            req.flash("message", "Password Not Match.....");
            console.log("Password Not Match.....");
            res.redirect("/admin");
          }
        } else {
          req.flash("message", "You are not Admin");
          console.log("Admin False...");
          res.redirect("/admin");
        }
      } else {
        req.flash("message", "Email Not Exist.......");
        console.log("Email Not Exist.......");
        res.redirect("/admin");
      }
    } else {
      req.flash("message", "Email Not Found.......");
      console.log("Email Not Found.......");
      res.redirect("/admin");
    }
  } catch (err) {
    console.error(err);
    req.flash("message", "An error occurred. Please try again later.");
    res.redirect("/admin");
  }
};

const adminAuth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin);
        next();
    } else {
        console.log('Err While Admin Auth');
        res.redirect('/admin')
    }
}

const alluser = async (req, res) => {
  try {
    // Modify the query to fetch only users with the role "user" and exclude those with "admin" role
    const users = await userModel.find({
      role: 'user',
      admin: { $ne: true } // Exclude users with admin set to true
    });

    res.render('Admin/alluser/index', {
      title: 'All User',
      admin: req.admin,
      users,
      url: req.url
    });
  } catch (err) {
    console.log(err);
    // Handle the error, e.g., send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const switchStatusOfUser = async (req, res) => {
  try {
    // Ensure that req.params.id is present
    if (!req.params.id) {
      console.error("Parameter 'id' is missing.");
      throw new Error("Parameter 'id' is missing.");
    }

    // Find the user by ID to get the previous isActive value
    const user = await userModel.findById(req.params.id);

    // Ensure the user is found
    if (!user) {
      console.error("User not found.");
      throw new Error("User not found.");
    }

    // Toggle the isActive property
    user.isActive = !user.isActive;

    // Save the updated user
    await user.save();

    // Flash a success message and redirect to the users page
    req.flash("switch", "Success.");
    return res.redirect("/admin/allemployee");
  } catch (error) {
    console.error(error);

    // Flash an error message and redirect to the users page
    req.flash("switch", "Failed!");
    return res.redirect("/admin/allemployee");
  }
};

const adminlogout=(req,res)=>{
    res.clearCookie('adminToken')
    res.redirect('/admin')

}

module.exports = {
  dashboard,
  login,
  adminloginpost,
  adminlogout,
  adminAuth,
  alluser,
  switchStatusOfUser,
  allEmployee
};
