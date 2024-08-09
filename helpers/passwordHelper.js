// helpers/passwordHelper.js

const bcrypt = require('bcrypt');

const passwordHelper = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  addPasswordFieldToSchema(schema) {
    schema.add({
      password: {
        type: String,
        required: true
      }
    });

    schema.pre('save', async function(next) {
      if (!this.isModified('password')) {
        return next();
      }
      this.password = await passwordHelper.hashPassword(this.password);
      next();
    });

    schema.methods.comparePassword = async function(candidatePassword) {
      return passwordHelper.comparePassword(candidatePassword, this.password);
    };
  }
};

module.exports = passwordHelper;