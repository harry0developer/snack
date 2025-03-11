const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    name: {
      type: String,
      required: false,
    },
    lat: {
      type: Number,
      required: false,
    },
    lng: {
      type: Number,
      required: false,
    },
  },
  images: {
    type: [String],
    required: false,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, 
  },
  username: {
    type: String,
    required: true,
    unique: true,   
  },
  password: {
    type: String,
    required: true,
  },
  ethnicity: {
    type: String,
    required: true,
  },
  bodyType: {
    type: String,
    required: true,
  },
  sexualOrientation: {
    type: String,
    required: true,
  },
  interests: {
    type: [String],
    required: true,
  },
  preferences: {
    ethnicity: {
      type: [String],
      required: false,
    },
    age: {
      lower: {
        type: Number,
        required: true,
      },
      upper: {
        type: Number,
        required: true,
      },
    },
    want: {
      type: [String],
      required: true,
    },
    with: {
      type: [String],
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
