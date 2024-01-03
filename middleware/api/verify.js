const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken')

exports.checkDuplicate = async (req, res, next) => {
  try {
    const username = await userModel.findOne({ name: req.body.name });
    const email = await userModel.findOne({ email: req.body.email });

    if (username) {
      return res.status(400).json({
        status: false,
        message: 'Username already exists',
      });
    }

    if (email) {
      return res.status(400).json({
        status: false,
        message: 'Email already exists',
      });
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'Password and confirm password do not match',
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: 'Error while checking for duplicates',
    });
  }
};

