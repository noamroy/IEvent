const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    id: { type : Number, required: true },
    firstName : { type : String, required: true },
    lastName: { type : String }, 
    password: { type : String , required: true }
}, { collection: 'users' });
const User = model('user', userSchema);
module.exports = User;