// src/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Ensure API_BASE_URL is defined using Vite's import.meta.env
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

function Home() {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [isHistoryError, setIsHistoryError] = useState(null);
  const [isHistoryData, setIsHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [isLeaderboardData, setIsLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [isLeaderboardError, setIsLeaderboardError] = useState(null);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const navigate = useNavigate();

  const isInvalidNames =
    player1Name.length > 20 ||
    player2Name.length > 20 ||
    player1Name === player2Name ||
    !player1Name ||
    !player2Name;

  const handleStart = () => {
    if (player1Name && player2Name) {
      const gameUrl = `/game?player1Name=${encodeURIComponent(
        player1Name
      )}&player2Name=${encodeURIComponent(player2Name)}`;
      navigate(gameUrl);
      setIsStartModalOpen(false);
    } else {
      alert("Please enter names for both players!");
    }
  };

  const handleStartGame = () => {
    setIsStartModalOpen(true);
  };

  const handleCloseStartModal = () => {
    setIsStartModalOpen(false);
  };

  const handleOpenLeaderboardModal = async () => {
    setIsLeaderboardModalOpen(true);
    setIsLoadingLeaderboard(true);
    setIsLeaderboardError(null);
    let localStorageData = localStorage.getItem("recordedHistory");
    localStorageData = localStorageData ? JSON.parse(localStorageData) : [];

    const endpoint = `${API_BASE_URL}/api/show-winner`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => b.wins - a.wins);
      console.log("Fetched leaderboard data:", sortedData);
      setIsLeaderboardData(sortedData);
    } catch (error) {
      console.error("Error fetching player history:", error);
      // setIsLeaderboardError("Failed to load history. Please try again later.");
      setIsLeaderboardData(localStorageData);
      console.log("Using local storage data:", localStorageData);
    } finally {
      setIsLoadingLeaderboard(false);
      console.log("Leaderboard data loaded:", isLeaderboardData);
    }
  };
  const handleOpenHistoryModal = async (playerName) => {
    setIsLeaderboardModalOpen(false);
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);
    setIsHistoryError(null);
    // Pass playerName as a query param
    const endpoint = `${API_BASE_URL}/api/history?playerName=${encodeURIComponent(
      playerName
    )}`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsHistoryData(data ? [data] : []);
      
    } catch (error) {
      console.error("Error fetching player history:", error);
      setIsHistoryError("Failed to load history. Please try again later.");
      setIsHistoryData([]);
    } finally {
      setIsLoadingHistory(false);
      console.log("History data loaded:", isHistoryData);  
    }
  };

  const handleCloseLeaderboardModal = () => {
    setIsLeaderboardModalOpen(false);
    setIsLeaderboardError(null);
  };
  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setIsHistoryError(null);
    console.log("History modal closed");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: `url('/home-page-bg.gif')` }} // Assuming image is in public folder
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-pink-500 text-5xl sm:text-6xl font-pixelify [text-shadow:_0_0_5px_theme(colors.pink.600),_0_0_10px_theme(colors.pink.700),_0_0_15px_theme(colors.pink.800),_0_0_25px_theme(colors.pink.900)] mb-10 text-center">
          Tic-Tac-Toe
        </h1>

        <button
          className="
            mt-6 sm:mt-10
            bg-transparent
            text-pink-500
            text-2xl sm:text-3xl
            font-pixelify
            py-3 px-6
            border border-pink-500
            rounded-md
            transition-all duration-300 ease-in-out
            [box-shadow:0_0_5px_theme(colors.pink.500),_0_0_15px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700),_0_0_45px_theme(colors.pink.800)]
            hover:bg-pink-500
            hover:text-gray-900
            hover:[box-shadow:0_0_10px_theme(colors.pink.600),_0_0_20px_theme(colors.pink.700),_0_0_40px_theme(colors.pink.800),_0_0_60px_theme(colors.pink.900)]
            focus:outline-none
            focus:ring-2
            focus:ring-pink-500
            focus:ring-opacity-50
            w-64 sm:w-auto
          "
          onClick={handleStartGame}
        >
          Play Game
        </button>

        <button
          className="
            mt-6 sm:mt-10
            bg-transparent
            text-pink-500
            text-2xl sm:text-3xl
            font-pixelify
            py-3 px-6
            border border-pink-500
            rounded-md
            transition-all duration-300 ease-in-out
            [box-shadow:0_0_5px_theme(colors.pink.500),_0_0_15px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700),_0_0_45px_theme(colors.pink.800)]
            hover:bg-pink-500
            hover:text-gray-900
            hover:[box-shadow:0_0_10px_theme(colors.pink.600),_0_0_20px_theme(colors.pink.700),_0_0_40px_theme(colors.pink.800),_0_0_60px_theme(colors.pink.900)]
            focus:outline-none
            focus:ring-2
            focus:ring-pink-500
            focus:ring-opacity-50
            w-64 sm:w-auto
          "
          onClick={handleOpenLeaderboardModal}
        >
          Show History
        </button>

        {/* Start Game Modal */}
        {isStartModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full relative text-white border-2 border-pink-600 [box-shadow:0_0_15px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700)]">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                onClick={handleCloseStartModal}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 className="text-2xl sm:text-3xl font-pixelify mb-6 text-center text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]">
                Game Setup
              </h2>
              <p className="mb-6 text-center font-pixelify text-gray-300">
                Enter player names to start the Tic-Tac-Toe battle!
              </p>
              <div className="mb-4">
                <label
                  htmlFor="player1Name"
                  className="block text-lg font-pixelify mb-2 text-pink-400"
                >
                  Player 1
                </label>
                <input
                  id="player1Name"
                  type="text"
                  placeholder="Player 1 name"
                  className="border border-pink-500 rounded-md py-2 px-4 w-full text-center font-pixelify bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="player2Name"
                  className="block text-lg font-pixelify mb-2 text-pink-400"
                >
                  Player 2
                </label>
                <input
                  id="player2Name"
                  type="text"
                  placeholder="Player 2 name"
                  className="border border-pink-500 rounded-md py-2 px-4 w-full text-center font-pixelify bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-pink-600 text-white py-3 px-8 rounded-md hover:bg-pink-700 font-pixelify text-lg sm:text-xl transition-colors duration-300 [box-shadow:0_0_8px_theme(colors.pink.600)]"
                  onClick={handleStart}
                  disabled={isInvalidNames}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Modal */}
        {isLeaderboardModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full relative text-white border-2 border-pink-600 [box-shadow:0_0_15px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700)]">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                onClick={handleCloseLeaderboardModal}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 className="text-2xl sm:text-3xl font-pixelify mb-6 text-center text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]">
                Player History
              </h2>
              {isLoadingLeaderboard && (
                <p className="text-center font-pixelify text-pink-400">
                  Loading history...
                </p>
              )}
              {isLeaderboardError && (
                <p className="text-center font-pixelify text-red-500">
                  {isLeaderboardError}
                </p>
              )}
              {!isLoadingLeaderboard && !isLeaderboardError && (
                <>
                  {isLeaderboardData.length === 0 ? (
                    <p className="text-center font-pixelify text-gray-400">
                      No game history found.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-4 w-full max-w-md">
                      {isLeaderboardData.map((player, index) => (
                        <button
                          key={player._id || index}
                          className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600"
                          onClick={() => handleOpenHistoryModal(player.name)}
                        >
                          <span className="font-pixelify text-lg text-pink-400">
                            {index + 1}. {player.name}
                          </span>
                          <span className="font-pixelify text-lg text-white">
                            Wins: {player.wins}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-center mt-6">
                <button
                  className="bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700 font-pixelify text-base sm:text-lg transition-colors duration-300 [box-shadow:0_0_8px_theme(colors.pink.600)]"
                  onClick={handleCloseLeaderboardModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isHistoryModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full relative text-white border-2 border-pink-600 [box-shadow:0_0_15px_theme(colors.pink.600),_0_0_30px_theme(colors.pink.700)]">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
                onClick={handleCloseHistoryModal}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2 className="text-2xl sm:text-3xl font-pixelify mb-6 text-center text-pink-500 [text-shadow:_0_0_5px_theme(colors.pink.600)]">
                Player History
              </h2>
              {isLoadingHistory && (
                <p className="text-center font-pixelify text-pink-400">
                  Loading history...
                </p>
              )}
              {isHistoryError && (
                <p className="text-center font-pixelify text-red-500">
                  {isHistoryError}
                </p>
              )}
              {!isLoadingHistory && !isHistoryError && (
                <>
                
                  {isHistoryData.length === 0 ? (
                    <p className="text-center font-pixelify text-gray-400">
                      No game history found.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-4 w-full max-w-md">
                      {isHistoryData.map((game, index) => (
                        <div
                          key={game._id || index}
                          className="w-full flex flex-col gap-2 p-3 bg-gray-700 rounded-md border border-gray-600 mb-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-pixelify text-lg text-pink-400">
                              Game #{index + 1}
                            </span>
                            <span className="font-pixelify text-lg text-white">
                              Winner: {game.winnerName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-pixelify text-base text-gray-300">
                              Player X: {game.playerX}
                            </span>
                            <span className="font-pixelify text-base text-gray-300">
                              Player O: {game.playerO}
                            </span>
                          </div>
                          <div className="font-pixelify text-sm text-gray-400">
                            Played at: {new Date(game.timestamp).toLocaleString()}
                          </div>
                          <div className="mt-2">
                            <span className="font-pixelify text-xs text-pink-300">Board:</span>
                            <div className="grid grid-cols-3 gap-1 mt-1 w-28">
                              {game.game.map((cell, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 flex items-center justify-center border border-pink-400 rounded bg-gray-800 text-xl text-white"
                                >
                                  {cell || ""}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-center mt-6">
                <button
                  className="bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700 font-pixelify text-base sm:text-lg transition-colors duration-300 [box-shadow:0_0_8px_theme(colors.pink.600)]"
                  onClick={handleCloseHistoryModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; // Export as HomePage
