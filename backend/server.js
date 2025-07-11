// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Player = require("./models/Player");
const GameHistory = require("./models/GameHistory");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

const mongoURI = process.env.MONGO_URI;
console.log("Attempting to connect to:", mongoURI); // Add this line
mongoose
  .connect(mongoURI)
  .then(() =>
    console.log(
      `MongoDB connected successfully: ${mongoose.connection.db.databaseName}`
    )
  )
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Backend server is running on port: ${port}`);
});
app.get("/api/history", async (req, res) => {
  const { playerName } = req.query;
  try {
    // Find the most recent game history for the player
    const history = await GameHistory.findOne({
      $or: [{ playerX: playerName }, { playerO: playerName }],
    }).sort({ timestamp: -1 }); // Most recent game
    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching player's history" });
  }
});
app.get("/api/show-winner", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching players" });
  }
});

app.post("/api/record-win", async (req, res) => {
  const { winnerName } = req.body;
  const { squares } = req.body;
  const { playerX, playerO } = req.body; // Assuming player names are passed in the request body

  if (!winnerName) {
    return res.status(400).json({ message: "Winner name is required" });
  }

  try {
    // Find the player or create them if they don't exist
    let player = await Player.findOne({ name: winnerName });
    new GameHistory({
      playerX: playerX, // Replace with actual player names
      playerO: playerO, // Replace with actual player names
      winnerName: winnerName,
      game: squares, // Assuming squares is the game state
      timestamp: new Date(), // Add timestamp for the game history
    }).save();
    if (player) {
      // Increment win count if player exists
      player.wins += 1;
      await player.save();
    } else {
      // Create a new player if they don't exist
      player = new Player({ name: winnerName, wins: 1 });
      await player.save();
    }
    res.status(200).json({ message: "Win recorded successfully", player });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error recording win" });
  }
});
