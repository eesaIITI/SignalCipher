const mongoose = require('mongoose');
const QuestionsSchema = new mongoose.Schema({
    Q_Num: { type: Number, required: true, unique: true },
    Q_Title: { type: String, required: true, unique: true },
    Q_Des: { type: String, required: true, unique: true },
    Q_Img: { type: String, required: true, unique: true },
    Flag: { type: String },
});

const QuestionsModel = mongoose.model('questions' , QuestionsSchema);
module.exports = QuestionsModel

