// src/Game.jsx
"use client"; // While not strictly necessary for Vite, keeping it for clarity if you might use RSC later

import React, { useState, useEffect, useCallback } from "react";
// Import hooks from react-router-dom for navigation and query parameters
import { useNavigate, useLocation } from "react-router-dom";

// Ensure API_BASE_URL is defined
// For Vite, you typically use import.meta.env.VITE_YOUR_VAR
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Helper function to determine the winner ('X' or 'O')
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Returns 'X' or 'O'
    }
  }
  return null;
}

// Helper function to find the winning line indices
function findWinningLineIndices(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]; // Return the array of indices [a, b, c]
      console.log(lines);
    }
  }
  return null;
}

// Board Square Component (Keep this the same)
function Square({ value, onClick, isWinningSquare }) {
  const glowClass = isWinningSquare
    ? "text-pink-400 [text-shadow:_0_0_10px_theme(colors.pink.500),_0_0_20px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700)]"
    : "text-pink-500 group-hover:text-pink-400 group-hover:[text-shadow:_0_0_5px_theme(colors.pink.500),_0_0_10px_theme(colors.pink.600)]";

  return (
    <button
      className={`w-24 h-24 md:w-32 md:h-32 bg-gray-800 flex items-center justify-center text-5xl md:text-6xl border border-pink-700 cursor-pointer transition-all duration-200 ease-in-out group ${
        isWinningSquare ? "bg-pink-900" : "hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      <span className={`font-pixelify ${glowClass}`}>{value}</span>
    </button>
  );
}

// The main Game component
function Game() {
  // Use useNavigate for navigation
  const navigate = useNavigate();
  // Use useLocation to get query parameters
  const location = useLocation();

  // Get player names from search parameters
  const searchParams = new URLSearchParams(location.search);
  const player1Name = searchParams.get("player1Name") || "Player 1";
  const player2Name = searchParams.get("player2Name") || "Player 2";

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isDraw, setIsDraw] = useState(false);

  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");

  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);

  // Effect to randomize who is X and O
  useEffect(() => {
    const randomXO = Math.random() < 0.5;
    if (randomXO) {
      setPlayerX(player1Name);
      setPlayerO(player2Name);
    } else {
      setPlayerX(player2Name);
      setPlayerO(player1Name);
    }
  }, [player1Name, player2Name]); // Depends on player names

  // Effect to fetch initial win counts
  useEffect(() => {
    // Only fetch if player names are available (not default "Player X")
    if (player1Name === "Player 1" && player2Name === "Player 2") {
      setPlayer1Wins(0);
      setPlayer2Wins(0);
      return;
    }

    const fetchWins = async () => {
      // Use the environment variable for the API base URL
      const endpoint = `${API_BASE_URL}/api/show-winner`;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          setPlayer1Wins(0);
          setPlayer2Wins(0);
          return;
        }
        const allPlayers = await response.json();

        const p1Data = allPlayers.find((p) => p.name === player1Name);
        const p2Data = allPlayers.find((p) => p.name === player2Name);

        setPlayer1Wins(p1Data ? p1Data.wins : 0);
        setPlayer2Wins(p2Data ? p2Data.wins : 0);
      } catch (error) {
        console.error("Error fetching player wins:", error);
        setPlayer1Wins(0); // Default to 0 on error
        setPlayer2Wins(0);
      }
    };

    fetchWins();
  }, [player1Name, player2Name]); // Re-fetch if player names change

  const winner = calculateWinner(squares);
  const winningLineIndices = winner ? findWinningLineIndices(squares) : null;

  const currentPlayerName = xIsNext ? playerX : playerO;

  const recordWin = useCallback(
    async (winnerName) => {

      const recordedHistory =
        JSON.parse(localStorage.getItem("recordedHistory")) || [];
      
      const recordedLeaderboard = JSON.parse(localStorage.getItem("recordedLeaderboard")) || [];

      const player = recordedLeaderboard.find(p => p.name === winnerName)

      if (player){
        player.wins++;
        console.log(player.wins)
      
      }else{
        let recordPlayer = {
          name: winnerName,
          wins: 1
        }
        recordedLeaderboard.push(recordPlayer);
      }

      const recordHistory = {
        winnerName,
        game: squares,
        playerX,
        playerO,
        timestamp: new Date().toISOString(),
      };

      recordedHistory.push(recordHistory);
      localStorage.setItem("recordedLeaderboard", JSON.stringify(recordedLeaderboard))
      localStorage.setItem("recordedHistory", JSON.stringify(recordedHistory));

      const testHistory = localStorage.getItem("recordedHistory");
      console.log("Recorded History:", testHistory);

      if (!winnerName || winnerName === "Player 1" || winnerName === "Player 2")
        return; // Do not record wins for default names
      // Offline storage for the win record

      const endpoint = `${API_BASE_URL}/api/record-win`;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ winnerName, squares, playerX, playerO }),
        });
        const data = await response.json();

        console.log("Response from server:", data);
        console.log(data.player.name);
        if (response.ok) {
          if (data.player.name === player1Name) {
            setPlayer1Wins(data.player.wins);
          } else if (data.player.name === player2Name) {
            setPlayer2Wins(data.player.wins);
          }
        } else {
          console.error("Error recording win:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    },
    [player1Name, player2Name, setPlayer1Wins, setPlayer2Wins, squares]
  );

  useEffect(() => {
    if (winner) {
      const winnerPlayerName = winner === "X" ? playerX : playerO;
      if (winnerPlayerName) {
        console.log(`Game Over! Winner: ${winnerPlayerName}`);
        recordWin(winnerPlayerName);
      }
    } else if (!winner && squares.every((square) => square !== null)) {
      setIsDraw(true);
      console.log("It's a Draw!");
    } else {
      setIsDraw(false);
    }
  }, [squares, winner, playerX, playerO, recordWin]);

  const handleClick = (i) => {
    if (winner || squares[i] || isDraw) {
      // Added check for isDraw
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsDraw(false);
    // Re-randomize X/O for the next round
    const randomXO = Math.random() < 0.5;
    if (randomXO) {
      setPlayerX(player1Name);
      setPlayerO(player2Name); // Corrected typo
    } else {
      setPlayerX(player2Name);
      setPlayerO(player1Name);
    }
  };

  const handleGoHome = () => {
    navigate("/"); // Use navigate for routing back to the home page
  };

  let status;
  if (winner) {
    status = `Winner: ${winner === "X" ? playerX : playerO}`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = `Current Turn: ${currentPlayerName} (${xIsNext ? "X" : "O"})`;
  }

  const renderSquare = (i) => {
    const isWinningSquare =
      winner && winningLineIndices && winningLineIndices.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-pixelify flex flex-col items-center p-4">
      <h1 className="text-6xl md:text-7xl text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600),_0_0_10px_theme(colors.pink.700)] text-center">
        Tic-Tac-Toe
      </h1>

      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-5xl flex-grow mt-8">
        {/* Player 1 Info (Left) */}
        <div className="text-center md:text-left mb-8 md:mb-0 md:mr-4 lg:mr-8 flex-shrink-0 max-w-56 lg:max-w-64 w-full">
          {/* Check if player names are default before displaying wins */}
          {player1Name !== "Player 1" && player2Name !== "Player 2" && (
            <p className="text-sm md:text-base text-gray-400 mb-1">
              Wins: {player1Wins}
            </p>
          )}
          <h2
            className={`text-xl md:text-2xl mb-2 ${
              (xIsNext && playerX === player1Name) ||
              (!xIsNext && playerO === player1Name)
                ? "text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]"
                : "text-gray-400"
            }`}
          >
            Player 1: {player1Name} ({playerX === player1Name ? "X" : "O"})
          </h2>
          <p className="text-base md:text-lg text-gray-400 break-words">
            {/* You can add more player 1 stats here later */}
          </p>
        </div>

        {/* Game Board and Status Container */}
        <div className="flex flex-col items-center flex-grow mx-2">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {Array(9)
              .fill(null)
              .map((_, i) => renderSquare(i))}
          </div>
          <div
            className={`mt-8 text-xl md:text-2xl text-center ${
              winner
                ? "text-green-500 [text-shadow:_0_0_5px_theme(colors.green.600)]"
                : isDraw
                ? "text-yellow-500 [text-shadow:_0_0_5px_theme(colors.yellow.600)]"
                : "text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]"
            }`}
          >
            {status}
          </div>
          {(winner || isDraw) && (
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <button
                className="bg-transparent text-pink-500 text-xl md:text-2xl font-pixelify py-2 px-4 border border-pink-500 rounded-md transition-all duration-300 ease-in-out [box-shadow:0_0_5px_theme(colors.pink.500),_0_0_15px_theme(colors.pink.600)] hover:bg-pink-500 hover:text-gray-900 hover:[box-shadow:0_0_10px_theme(colors.pink.600),_0_0_20px_theme(colors.pink.700)] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={handleRestart}
              >
                Restart Game
              </button>
              <button
                className="bg-transparent text-gray-400 text-xl md:text-2xl font-pixelify py-2 px-4 border border-gray-400 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                onClick={handleGoHome}
              >
                Go Home
              </button>
            </div>
          )}
        </div>

        {/* Player 2 Info (Right) */}
        <div className="text-center md:text-right mt-8 md:mt-0 md:ml-4 lg:ml-8 flex-shrink-0 max-w-56 lg:max-w-64 w-full">
          {/* Check if player names are default before displaying wins */}
          {player1Name !== "Player 1" && player2Name !== "Player 2" && (
            <p className="text-sm md:text-base text-gray-400 mb-1">
              Wins: {player2Wins}
            </p>
          )}
          <h2
            className={`text-xl md:text-2xl mb-2 ${
              (xIsNext && playerX === player2Name) ||
              (!xIsNext && playerO === player2Name)
                ? "text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]"
                : "text-gray-400"
            }`}
          >
            Player 2: {player2Name} ({playerX === player2Name ? "X" : "O"})
          </h2>
          <p className="text-base md:text-lg text-gray-400 break-words">
            {/* You can add more player 2 stats here later */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Game;
