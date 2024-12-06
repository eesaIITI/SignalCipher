const mongoose = require('mongoose');
const QuestionsSchema = new mongoose.Schema({

});

const QuestionsModel = mongoose.model('questions' , QuestionsSchema);
module.exports = QuestionsModel

