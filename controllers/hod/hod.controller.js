const { Program } = require('../../models/Program')
const { Department } = require('../../models/Department');


exports.createProgram = async (req, res) => {
  try {
    const { name, code, departmentCode, duration, semesters } = req.body;

    const department = await Department.findOne({ code: departmentCode })

    if (!department) return res.status(404).json({
      error: "department not found"
    })

    const program = new Program({
      name,
      code,
      department: department._id,
      duration,
      semesters
    })

    await program.save()

    res.status(201).json({
      message: "program created successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "ohh my gosh! looks like something wrong"
    })
  }
}