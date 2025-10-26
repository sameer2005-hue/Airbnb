const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose)  // plugin use because hasing, salting, username, password automatically involve kr deta h
// also variou method

module.exports = mongoose.model('User', userSchema);
