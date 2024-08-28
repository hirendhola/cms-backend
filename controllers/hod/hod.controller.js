const { Program } = require('../../models/Program')
const { Department } = require('../../models/Department');
const { Course } = require('../../models/Course');
const { Subject } = require('../../models/Subject');
const mongoose = require('mongoose')
const { HOD } = require('../../models/HOD');
const { populate } = require('dotenv');

exports.createProgram = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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

    await program.save({ session })

    department.programs.push(program._id)
    await department.save({ session })

    await session.commitTransaction();
    session.endSession()

    res.status(201).json({
      message: "program created successfully",
    })

  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "ohh my gosh! looks like something wrong"
    })
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
  }
}

exports.createCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, code, programCode } = req.body;

    if (!name || !code || !programCode) res.send('please enter all fields!!');

    const program = await Program.findOne({ code: programCode })
    if (!program) return res.send("Program does not exist!")

    const course = new Course({
      name,
      code,
      program: program._id
    })
    course.save({ session })

    program.courses.push(course._id)
    await program.save({ session })

    await session.commitTransaction();
    session.endSession()

    res.status(401).json({
      message: "course created successfuly",
      courseId: course._id
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message)

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
  }
}

/* 
  example format for subject array of objecttttttt 
  i.e. 
    [
        {                 // first subject 
          "name",
          "code",
          "course",
          "semester",
        },
        {                 // second subject
          "name",
          "code",
          "course",
          "semester",
        }
    ]

    thats it for now lets seeeeeeee!!!!
*/

exports.addSubjects = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const courseId = req.params.courseId
    const course = await Course.findOne({ code: courseId })

    if (!course) return res.send("course not found");

    const subjects = req.body.subjects;

    if (!subjects) return res.send("please enter subjects");

    for (let subjectdata of subjects) {
      let subject = await Subject.findOne({ code: subjectdata.code });
      if (!subject) {
        subject = new Subject({ name: subjectdata.name, code: subjectdata.code, course: course._id, semester: subjectdata.semester });
        await subject.save({ session });
      }
      if (!course.subjects.includes(subject._id)) {
        course.subjects.push(subject._id);
      }
    }

    await course.save({ session });
    await session.commitTransaction();
    session.endSession()

    res.json({ success: true, subjects: subjects, course: course });
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.messaage)
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
  }
}



exports.profile = async (req, res) => {
  try {
    const email = req.email;

    const hod = await HOD.findOne({ email: email })
      .select('-password')
      .populate({
        path: 'department',
        populate: [
          {
            path: 'college',
          },
          {
            path: 'programs',
            populate: {
              path: 'courses',
              populate: {
                path: 'subjects',
                // populate: [{
                //   path: 'teachers'
                // }, {
                //   path: 'students' 
                // }
                // ] uncomment this when we create student and teacher tables 
              }
            }
          }
        ]
      })
      .exec();

    res.status(200).json({
      success: true,
      hod: hod,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error: "something got wrong"
    })
  }
}



// const { randomInt } = require('crypto');
// const { TeacherAccessCode } = require('../../models/AccessCodes');

// const generateRandomCode = () => {
//   return randomInt(100000, 999999);
// };

// exports.generateCode = async (req, res) => {
//   try {
//     const name = req.params.course;
//     if (!name) return res.status(400).json({ error: "Department name not received" });

//     const department = await Department.findOne({ name });
//     if (!department) return res.status(404).json({ error: "Department not found. Please create it first." });

//     // Check if an access code already exists for this department
//     let teacherAccessCode = await TeacherAccessCode.findOne({ course: department._id });

//     const newAccessCode = generateRandomCode();

//     if (teacherAccessCode) {
//       // If an access code exists, update it
//       teacherAccessCode.accessCode = newAccessCode;
//       await teacherAccessCode.save();
//     } else {
//       // If no access code exists, create a new one
//       teacherAccessCode = new TeacherAccessCode({
//         department: department._id,
//         accessCode: newAccessCode
//       });
//       await teacherAccessCode.save();
//     }

//     return res.status(200).json({
//       message: `New access code generated for ${name}`,
//       accessCode: newAccessCode
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Failed to generate access code' });
//   }
// };