// backend/models/GameHistory.js
const mongoose = require("mongoose");

const gameHistorySchema = new mongoose.Schema({
  playerX: {
    type: String,
    required: true,
  },
  playerO: {
    type: String,
    required: true,
  },
  winnerName: {
    type: String,
    required: true,
  },
  game: {
    type: Array,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const GameHistory = mongoose.model("GameHistory", gameHistorySchema);

module.exports = GameHistory;
