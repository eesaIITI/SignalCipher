const mongoose = require('mongoose');

const SolveHistorySchema = new mongoose.Schema({
  Qno: { type: Number, required: true },
  SolvedAt: { type: String, required: true } // Store readable IST string
});

const UsersSchema = new mongoose.Schema({
  UserEmail: { type: String, required: true, unique: true },
  UserName: { type: String },
  Qns_Solved: { type: [Number], default: [] }, // Array of solved question numbers
  CurrQn: { type: Number, default: 0 },
  SolveHistory: { type: [SolveHistorySchema], default: [] } // New field for timestamps
});

const UsersModel = mongoose.model('users', UsersSchema);
module.exports = UsersModel;
