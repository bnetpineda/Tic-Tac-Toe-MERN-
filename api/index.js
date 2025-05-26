// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Keep this if you have static files, though less common for API
require("dotenv").config(); // This is usually not needed in Vercel as you use Vercel's env variables

// Import your Player model (adjust the path as needed)
const Player = require("../backend/models/Player");

const app = express();
// Remove the port variable and app.listen()

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

// **Important:** Connect only if the connection is not already established
// This prevents creating new connections on every function invocation
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in environment variables!");
    // Depending on your needs, you might want to throw an error here
    return;
  }

  console.log("Attempting to connect to:", mongoURI);
  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log(
      `MongoDB connected successfully: ${mongoose.connection.db.databaseName}`
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Depending on your needs, you might want to throw an error here
    throw err; // Re-throw the error to signal connection failure
  }
}

// Define your routes within the function that connects to the database
// This ensures the database is connected before handling requests
app.get("/api/show-winner", async (req, res) => {
  try {
    await connectToDatabase(); // Ensure connection before query
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    // Return a more informative error if the database connection failed
    if (!isConnected && err.message.includes("MongoDB connection error")) {
        res.status(500).json({ message: "Database connection error" });
    } else {
        res.status(500).json({ message: "Error fetching players" });
    }
  }
});

app.post("/api/record-win", async (req, res) => {
  const { winnerName } = req.body;

  if (!winnerName) {
    return res.status(400).json({ message: "Winner name is required" });
  }

  try {
    await connectToDatabase(); // Ensure connection before query

    // Find the player or create them if they don't exist
    let player = await Player.findOne({ name: winnerName });

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
     if (!isConnected && err.message.includes("MongoDB connection error")) {
        res.status(500).json({ message: "Database connection error" });
    } else {
       res.status(500).json({ message: "Error recording win" });
    }
  }
});

// Export the Express app instance
module.exports = app;
