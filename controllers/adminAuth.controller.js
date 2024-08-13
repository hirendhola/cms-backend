const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Admin } = require('../models/Admin');
const { College } = require('../models/College');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokenUtils');

exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("before extracting data from req.body");

    const {
      name,
      email,
      mobileNumber,
      password,
      uniName,
      collegeName,
      collegeCode,
      address,
    } = req.body;

    console.log("before college creation");

    const college = new College({ uniName, collegeName, collegeCode, address });
    await college.save({ session });
    console.log("after college creation");

    const admin = new Admin({
      name,
      email,
      mobileNumber,
      password,
      college: college._id
    });

    await admin.save({ session });
    console.log("admin created and saved");

    college.principal = admin._id;
    await college.save({ session });
    console.log("college updated with principal");


    const accessToken = generateAccessToken({ adminId: admin._id, name, email });
    const refreshToken = generateRefreshToken({ adminId: admin._id, name, email });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await session.commitTransaction();
    session.endSession();
    console.log("transaction committed");


    res.status(201).json({
      message: 'Admin and College created successfully',
      accessToken
    });

  } catch (error) {
    console.error("Error occurred:", error.message);

    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ error: `College with code "${collegeCode}" already exists. Please use a different code.` });
    } else {
      res.status(400).json({ error: 'Failed to create admin and college. Please try again.' });
    }

    // Only abort the transaction if it hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).send({
        error: "invalid email address"
      })
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({
        error: "Invalid password"
      });
    }

    const accessToken = generateAccessToken({ adminId: admin._id, name: admin.name, email: admin.email });
    const refreshToken = generateRefreshToken({ adminId: admin._id, name: admin.name, email: admin.email });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({
      error: "Internal server error. Please try again later."
    });
  }
}

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.send({ message: 'Logged out successfully' });
};

exports.refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) return res.status(401).send({ error: 'Refresh token required' });

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken({ adminId: decoded.adminId });

    // Option 1: Generate a new refresh token
    const newRefreshToken = generateRefreshToken({ adminId: decoded.adminId });

    // Set the new refresh token with a renewed expiry time
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.send({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res
      .status(403)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .send({ error: 'Invalid refresh token' });
  }
};

