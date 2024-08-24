const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Admin } = require('../../models/Admin');
const { College } = require('../../models/College');
const { generateAccessToken, generateRefreshToken } = require('../../helpers/tokenUtils');

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

    // Production: Ensure async operations are awaited
    const isAdminExist = await Admin.findOne({ email }).select('-password');
    const isCollegeExist = await College.findOne({ collegeCode });
    if (isAdminExist || isCollegeExist) {
      return res.status(400).json({
        message: "User exists",
      });
    }

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

    // Generate tokens
    const accessToken = generateAccessToken({ adminId: admin._id, name, email, role: "admin" });
    const refreshToken = generateRefreshToken({ adminId: admin._id, name, email, role: "admin" });

    // Production: Set secure, HTTP-only cookie for the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Commit the transaction
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

    // Production: Abort the transaction only if it hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession(); // Ensure session is ended even in case of an error
  }
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).send({
        error: "Invalid email address"
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({
        error: "Invalid password"
      });
    }

    const accessToken = generateAccessToken({ adminId: admin._id, name: admin.name, email: admin.email, role: "admin" });
    const refreshToken = generateRefreshToken({ adminId: admin._id, name: admin.name, email: admin.email, role: "admin" });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
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
};

exports.logout = (req, res) => {
  // Production: Clear secure, HTTP-only cookie on logout
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  res.send({ message: 'Logged out successfully' });
};

exports.refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) return res.status(401).send({ error: 'Refresh token required' });

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new tokens
    const accessToken = generateAccessToken({ adminId: decoded.adminId, name: decoded.name, email: decoded.email, role: "admin" });
    const newRefreshToken = generateRefreshToken({ adminId: decoded.adminId, name: decoded.name, email: decoded.email, role: "admin" });

    // Production: Set secure, HTTP-only cookie for the new refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res
      .status(403)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      })
      .send({ error: 'Invalid refresh token' });
  }
};

exports.checkAuthStatus = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    res.status(200).json({
      message: 'User logged in',
      user: {
        id: decoded.adminId,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    res.status(403).clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    }).send({ error: 'Invalid refresh token' });
  }
};


exports.verifyToken = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, adminId: decoded.adminId });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

