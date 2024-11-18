const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true },
name:{type:String,required:true},
token:{type:String}
});

const UserWithToken = mongoose.model('UserWithToken', userSchema);

module.exports = UserWithToken;
