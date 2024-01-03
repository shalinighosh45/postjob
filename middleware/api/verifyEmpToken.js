const jwt = require('jsonwebtoken')

const verifyEmpToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    //console.log('Token',token);
  
    if (!token) {
      return res.status(404).json({
        status: false,
        message: "Could not find the token",
      });
    }
  
    try {
      const decodeToken = jwt.verify(token, process.env.JWT_KEY);
      req.employee = decodeToken;
      next();
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        status: false,
        message: "Error while verifying user",
      });
    }
  };


  module.exports=verifyEmpToken
  