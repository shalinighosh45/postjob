const jwt = require('jsonwebtoken')

exports.jwtAuth = async (req, res, next) => {
    if (req.cookies && req.cookies.userToken) {
        jwt.verify(req.cookies.userToken, process.env.JWT_KEY, (err, data) => {
            if (err) {
                console.log(err.message);
                next(); // Continue to the next middleware or route
            } else {
                req.user = data; // Set user data in the request object
                console.log(req.user);
                next(); // Continue to the next middleware or route
            }
        });
    } else {
        next(); // Continue to the next middleware or route
    }
};


