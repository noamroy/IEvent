const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    id: { type : Number, required: true },
    Name : { type : String, required: true },
    password: { type : String , required: true }
}, { collection: 'users' });
const User = model('user', userSchema);
module.exports = User;