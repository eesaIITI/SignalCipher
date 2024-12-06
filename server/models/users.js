const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    UserEmail: { type: String, required: true, unique: true },
    UserName: { type: String },
    QnsSolved: { type: [Number] }, // Array of numbers
});

const UsersModel = mongoose.model('users' , UsersSchema);
module.exports = UsersModel