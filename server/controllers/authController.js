const UserModel = require("../models/usersModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create a new user by admin or user signup
const signup = async (req, res) => {};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "User not found" });
    }

    // console.log(user);
    // compare hashed password with the stored password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid password" });
    }
    // generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

module.exports = {
  signup,
  login,
};
