const { Schema, model, Collection } = require('mongoose');
const userSchema = new Schema({
    id: { type: Number, index: 1, required: true },
}, { collection: 'users' });

userSchema.
    path('id')
    .validate(id => id >= 0, "Id must not be negative");

const User = model('User', userSchema);

module.exports = User;