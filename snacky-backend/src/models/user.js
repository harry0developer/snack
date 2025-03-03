const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: false },
  otpExpiresAt: { type: Date, required: false },
});


// const aboutSchema = new Schema({
//   race: { type: String, enum: ['white', 'indian', 'colored', 'black'], required: true },
//   body: { type: String, enum: ['slim', 'build', 'thick', 'slim-thick', 'bbw'], required: true },
//   skintone: { type: String, enum: ['light-skin', 'white', 'melanin'], required: true },
//   orientation: { type: String, enum: ['bi', 'gay', 'lesbian', 'trans', 'straight'], required: true }
// }, { _id: false }); 


// const interestsSchema = new Schema({
//   into: { type: String, enum: ['tattoos', 'piercings', 'long-hair', 'no-hair', 'beard'], required: true }
// }, { _id: false }); 

// const profileSchema = new Schema({
//   name: { type: String, required: true },
//   age: { type: Number, required: true },
//   gender: { type: String, required: true },
//   location: { type: String, required: true }
// }, { _id: false }); 


// const infoSchema = new Schema({
//   img: { type: String, required: true },
//   title: { type: String, required: true },
//   profile: profileSchema,
//   about: aboutSchema,
//   interests: interestsSchema
// }, { _id: false }); 

// const userSchema = new Schema({
//   name: { type: String, required: true },
//   age: { type: Number, required: true },
//   gender: { type: String, required: true },
//   location: { type: String, required: true },
//   info: [infoSchema]  
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
