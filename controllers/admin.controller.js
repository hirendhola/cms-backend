const { Admin } = require('../models/Admin');
const { College } = require('../models/College');

exports.profile = async (req, res) => {
  try {
    const email = req.email;

    const admin = await Admin.findOne({ email }).select('-password');
    if (admin) {
      const college = await College.findOne({ _id: admin.college })
        .populate({
          path: 'departments',
          select: 'name code'
        })
        .exec();

      res.status(200).json({ admin, college });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while fetching the profile' });
  }
};
