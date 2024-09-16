/*
hod can signin, signup
first need to connect to the department by the admin account

then can create add the  programs(BTECH, MTECH, program also have total year),  courses(computer, iot, etc...), subjects (basic subject , 
 may relete to years of program)

 after creating program he can select some of the teacher to teach the specific subject or may be many
 or can teach to multiple subject

 teacher can create group of student for better management  (like class room i.e. A, b,c )

 may be teacher also have other status like co ordinator 
 student also like CR 
*/


/* LETS DO IT HIREN - YO-HOHO YO-HOHO (onepiece ref.....) */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { generateAccessToken, generateRefreshToken } = require('../../helpers/tokenUtils');
const { HOD } = require('../../models/HOD');
const { HodAccessCode } = require('../../models/AccessCodes');
const { Department } = require('../../models/Department')

exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, mobileNumber, password, accessCode } = req.body;

    const isHodExist = await HOD.findOne({ accessCode }).select('-password');
    if (isHodExist) return res.status(403).json({
      error: "HOD with same department already exist",
    })

    const isAccessCodeExist = await HodAccessCode.findOne({ accessCode })
    if (!isAccessCodeExist) res.status(404).json({
      error: "Wrong Access Code"
    })

    const department = await Department.findOne({ _id: isAccessCodeExist.department })

    const hod = new HOD({
      name,
      email,
      mobileNumber,
      password,
      accessCode,
      department: department._id
    });

    await hod.save({ session });

    department.hod = hod._id;
    department.save({ session })

    // Generate tokens
    const accessToken = generateAccessToken({ hodId: hod._id, name, email, role: "hod" });
    const refreshToken = generateRefreshToken({ hodId: hod._id, name, email, role: "hod" });

    // Production: Set secure, HTTP-only cookie for the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.MODE === 'production' ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    console.log("transaction committed");

    res.status(201).json({
      message: 'hod created successfully',
      accessToken
    });

  } catch (error) {
    console.error("Error occurred:", error.message);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession(); // Ensure session is ended even in case of an error
  }
};


exports.signin = async (req, res) => {

  try {
    const { email, password } = req.body;

    const hod = await HOD.findOne({ email }).select();
    if (!hod) return res.status(403).json({
      error: "invalid email",
    })

    const isMatch = await hod.comparePassword(password)
    if (!isMatch) res.status(401).json({
      error: "invalid password"
    })

    // Generate tokens
    const accessToken = generateAccessToken({ hodId: hod._id, name: hod.name, email: hod.email, role: "hod" });
    const refreshToken = generateRefreshToken({ hodId: hod._id, name: hod.name, email: hod.email, role: "hod" });

    // Production: Set secure, HTTP-only cookie for the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.MODE === 'production' ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'login successfully',
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
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.MODE === 'production' ? 'Strict' : 'Lax',
  });

  res.removeHeader('Authorization');

  res.send({ message: 'Logged out successfully' });
};

exports.refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) return res.status(401).send({ error: 'Refresh token required' });

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new tokens
    const accessToken = generateAccessToken({ hodId: decoded.hodId, name: decoded.name, email: decoded.email, role: "hod" });
    const newRefreshToken = generateRefreshToken({ adminId: decoded.hodId, name: decoded.name, email: decoded.email, role: "hod" });

    // Production: Set secure, HTTP-only cookie for the new refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.MODE === 'production' ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res
      .status(403)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.MODE === 'production' ? 'Strict' : 'Lax',
      })
      .send({ error: 'Invalid refresh token' });
  }
};

