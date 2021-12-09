const { Schema, model, Collection } = require('mongoose');
const userSchema = new Schema({
    id: { type : Number, required: true },
    userid: {type : String, required: true},
    usertype: {type: String, required: true},
    firstName : { type : String, required: true },
    lastName: { type : String ,required: true }, 
    password: { type : String , required: true },
    phone: {type: String,required: true},
    email: {type: String,required: true}
}, { collection: 'users' });

userSchema.
    path('id')
    .validate(id => id >= 0, "Id must not be negative");

const User = model('User', userSchema);

module.exports = User;