const User = require("../models/User");

const generateToken = require("../utils/generateToken");

/*
====================================
@desc   Register User
@route  POST /api/auth/signup
====================================
*/

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields",
      });
    }

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const user = await User.create({
      name: fullName,
      email,
      password,
      role: "candidate",
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",

      token: generateToken(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Server error during signup",
      error: error.message,
    });
  }
};

/*
====================================
@desc   Login User
@route  POST /api/auth/login
====================================
*/

const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide email and password",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await user.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token: generateToken(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
      error: error.message,
    });
  }
};

/*
====================================
@desc   Get User Profile
@route  GET /api/auth/profile
====================================
*/

const getProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch profile",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};