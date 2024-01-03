const jwt = require('jsonwebtoken')

exports.jwtAuth = async (req, res, next) => {
    if (req.cookies && req.cookies.employeeToken) {
        jwt.verify(req.cookies.employeeToken, process.env.JWT_KEY, (err, data) => {
            if (err) {
                console.log(err.message);
                next(); // Continue to the next middleware or route
            } else {
                req.employee = data; // Set user data in the request object
               // console.log(req.employee);
                next(); // Continue to the next middleware or route
            }
        });
    } else {
        next(); // Continue to the next middleware or route
    }
};
