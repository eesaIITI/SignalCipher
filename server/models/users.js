const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({

});

const UsersModel = mongoose.model('users' , UsersSchema);
module.exports = UsersModel