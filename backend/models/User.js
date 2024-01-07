const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  profits: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: 'user',
  },
  profilePicUrl: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
});

// Method to set and hash the user's password
userSchema.methods.setPassword = function (password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

// Method to check if a provided password matches the stored hashed password
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
