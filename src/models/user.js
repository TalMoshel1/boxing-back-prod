import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: (value) => value.length > 4,
      message: 'Username must be longer than 4 characters'
    }
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Email must contain an "@" character'
    }
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

export const User = mongoose.model('User', UserSchema);





