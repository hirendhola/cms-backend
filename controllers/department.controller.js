const mongoose = require('mongoose');
const { Department } = require('../models/Department');
const { College } = require('../models/College');

exports.createDepartment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Transaction started");

  try {
    console.log("Before extracting data from req.body");

    const { name, code, collegeCode } = req.body;

    // Await the findOne call to resolve the Promise
    const college = await College.findOne({ collegeCode });

    if (!college) {
      // Handle case where college is not found
      throw new Error(`College with code "${collegeCode}" not found.`);
    }

    const department = new Department({
      name,
      code,
      college: college._id // Use the resolved college's _id
    });
    await department.save({ session });

    college.departments.push(department._id);
    await college.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("Transaction committed");

    res.status(201).json({
      message: 'Department created',
      departmentID: department._id
    });

  } catch (error) {
    console.error("Error occurred:", error.message);

    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.code === 11000) {
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
};
