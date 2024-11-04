"use client";

import { useState, useEffect } from "react";
import { Fish, type FishData } from "@/components/fish";
import { Rod } from "@/components/rod";
import { Score } from "@/components/score";
import { WavesSvg } from "@/components/waves";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Waves } from "lucide-react";

const GAME_DURATION = 120; // 2 minutes

export default function Home() {
  const [score, setScore] = useState(0);
  const [catches, setCatches] = useState<FishData[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowDialog(true);
    }
  }, [gameStarted, timeLeft]);

  const handleCatch = (position: { x: number; y: number }) => {
    const fishElements = document.querySelectorAll("[data-fish]");
    let caught = false;

    fishElements.forEach((fishElement) => {
      const rect = fishElement.getBoundingClientRect();
      const fishX = (rect.left / window.innerWidth) * 100;
      const fishY = (rect.top / window.innerHeight) * 100;

      const distance = Math.sqrt(
        Math.pow(position.x - fishX, 2) + Math.pow(position.y - fishY, 2)
      );

      if (distance < 10) {
        caught = true;
        const fishData = (fishElement as HTMLElement).dataset.fish;
        if (fishData) {
          const fish = JSON.parse(fishData) as FishData;
          setScore((prev) => prev + fish.points);
          setCatches((prev) => [...prev, fish]);
        }
      }
    });

    if (!caught) {
      // Add splash effect
      const splash = document.createElement("div");
      splash.className = "absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl";
      splash.style.left = `${position.x}%`;
      splash.style.top = `${position.y}%`;
      splash.textContent = "💦";
      document.getElementById("fishing-area")?.appendChild(splash);
      setTimeout(() => splash.remove(), 1000);
    }
  };

  const startNewGame = () => {
    setScore(0);
    setCatches([]);
    setTimeLeft(GAME_DURATION);
    setGameStarted(true);
    setShowDialog(false);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-300 to-blue-600">
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30" />
      <WavesSvg />

      {/* Game Area */}
      <div id="fishing-area" className="relative w-full h-full">
        {gameStarted && (
          <>
            <Fish />
            <Rod onCatch={handleCatch} />
            <Score score={score} catches={catches} timeLeft={timeLeft} />
          </>
        )}

        {/* Game Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Waves className="w-6 h-6 text-blue-500" />
                {timeLeft === 0 ? "Game Over!" : "Ocean Fisher"}
              </h2>
              
              {timeLeft === 0 ? (
                <div className="space-y-4">
                  <p className="text-lg">Final Score: {score}</p>
                  <p>You caught {catches.length} fish!</p>
                  <div className="flex flex-wrap gap-1">
                    {catches.map((fish, i) => (
                      <span key={i} className="text-2xl">{fish.emoji}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mb-4">
                  Cast your line with the perfect timing to catch different fish.
                  Rare fish are worth more points!
                </p>
              )}
              
              <Button 
                onClick={startNewGame}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {timeLeft === 0 ? "Play Again" : "Start Fishing"}
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </main>
  );
}