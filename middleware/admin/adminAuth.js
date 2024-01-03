const jwt = require('jsonwebtoken')
const userModel = require('../../model/userModel')

exports.jwtAdminAuth = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, process.env.JWT_KEY, (err, data) => {
            req.admin = data
            next()
        })
    } else {
        next()
    }
}

exports.isAdmin = (req, res, next) => {
  try {
      console.log('Admin Role:', req.admin ? req.admin.role : 'N/A');
      if (req.admin && req.admin.role === "admin") {
          next();
      } else {
          return res.status(401).json({
              status: false,
              message: "This is a protected route for Admins",
          });
      }
  } catch (err) {
      console.log(err.message);
      return res.status(500).json({
          status: false,
          message: "User role is not matching",
      });
  }
};