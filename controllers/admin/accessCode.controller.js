const { randomInt } = require('crypto');
const { HodAccessCode } = require('../../models/AccessCodes');
const { Department } = require('../../models/Department');

const generateRandomCode = () => {
  return randomInt(100000, 999999);
};

exports.generateCode = async (req, res) => {
  try {
    const name = req.params.department;
    if (!name) return res.status(400).json({ error: "Department name not received" });

    const department = await Department.findOne({ name });
    if (!department) return res.status(404).json({ error: "Department not found. Please create it first." });

    // Check if an access code already exists for this department
    let hodAccessCode = await HodAccessCode.findOne({ department: department._id });

    const newAccessCode = generateRandomCode();

    if (hodAccessCode) {
      // If an access code exists, update it
      hodAccessCode.accessCode = newAccessCode;
      await hodAccessCode.save();
    } else {
      // If no access code exists, create a new one
      hodAccessCode = new HodAccessCode({
        department: department._id,
        accessCode: newAccessCode
      });
      await hodAccessCode.save();
    }

    return res.status(200).json({
      message: `New access code generated for ${name}`,
      accessCode: newAccessCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to generate access code' });
  }
};