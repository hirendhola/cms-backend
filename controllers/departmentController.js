import mongoose, { startSession } from "mongoose";
import { Department } from "../models/Department"
import { College } from "../models/College";


exports.createDepartment = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("transaction stareted");

  try {
    console.log("before extracting data from req.body");

    const { name, code, collegeCode } = req.body;
    const college = College.findOne({ collegeCode });
    const department = new Department({
      name,
      code,
      college: college._id
    })

    await department.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("transaction committed");

    res.status(201).json({
      message: 'Department created',
      departmentID: department._id
    })

  } catch (error) {
    console.error("Error occurred:", error.message);

    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ error: `Department with code "${code}" already exists. Please use a different code.` });
    } else {
      res.status(400).json({ error: 'Failed to create Department. Please try again.' });
    }

    // Only abort the transaction if it hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    
    session.endSession();
  }
}