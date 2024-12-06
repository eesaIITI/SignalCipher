const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    UserEmail: { type: String, required: true, unique: true },
    UserName: { type: String },
    Qns_Solved: { type: [Number] }, // Array of numbers
    CurrQn : {type : Number,default: 0},
});

const UsersModel = mongoose.model('users' , UsersSchema);
module.exports = UsersModel
