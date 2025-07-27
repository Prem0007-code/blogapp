const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // ✅ correct case

const Schema = mongoose.Schema; // ✅ this must come from mongoose

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

// ✅ This must be applied to a proper Mongoose Schema object
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
