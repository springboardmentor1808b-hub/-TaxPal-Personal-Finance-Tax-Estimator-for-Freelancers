const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, default: 'USA' },
    income_bracket: { type: String, default: 'Middle' }
});

module.exports = mongoose.model('User', UserSchema);