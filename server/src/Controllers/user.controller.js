const User = require("../Models/user.model");
const generateToken = require("../Utils/jwtToken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const isUser = await User.findOne({ email }).select("-password");
    if (isUser?.email) {
      return res.status(409).json({
        message: "User already exists",
        user: isUser
      });
    }

    const user = await User.create({ name, email, password, role });
    const token = await generateToken(user, res);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userObj,
      token
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
};



module.exports.LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const isUser = await User.findOne({ email });

    if (!isUser?.email) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = await generateToken(isUser, res);
    const userObj = isUser.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "User logged in successfully",
      user: userObj,
      token
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging in"
    });
  }
};

module.exports.googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isOAuthUser = true;
        await user.save();
      }
    } else {
      user = await User.create({
        email,
        name,
        googleId,
        avatar,
        role: role || "user",
        isOAuthUser: true,
        password: Math.random().toString(36).slice(-10),
        isVerified: true
      });
    }

    const token = await generateToken(user, res);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Google login successful",
      user: userObj,
      token
    });
  } catch (error) {
    console.error("Error in Google Login:", error);
    return res.status(500).json({
      message: "Google login failed"
    });
  }
};


module.exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while logging out"
    });
  }
};


module.exports.getProfile = (req, res) => {
  try {
    if (!req.user?.name) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user: req.user
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving profile"
    });
  }
};