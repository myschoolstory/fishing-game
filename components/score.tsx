"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FishData } from "./fish";

interface ScoreProps {
  score: number;
  catches: FishData[];
  timeLeft: number;
}

export function Score({ score, catches, timeLeft }: ScoreProps) {
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    if (score !== lastScore) {
      setIsScoreAnimating(true);
      const timer = setTimeout(() => setIsScoreAnimating(false), 500);
      setLastScore(score);
      return () => clearTimeout(timer);
    }
  }, [score, lastScore]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRank = (score: number) => {
    if (score >= 50) return { title: "Master Angler", icon: "🎣" };
    if (score >= 30) return { title: "Expert Fisher", icon: "🐠" };
    if (score >= 15) return { title: "Skilled Fisher", icon: "🎏" };
    if (score >= 5) return { title: "Novice Fisher", icon: "🪝" };
    return { title: "Beginner", icon: "🐟" };
  };

  const rank = getRank(score);

  return (
    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg backdrop-blur-sm space-y-3 min-w-[200px]">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">Score:</span>
        </div>
        <span 
          className={cn(
            "text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all",
            isScoreAnimating && "scale-125 text-green-500"
          )}
        >
          {score}
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">Time:</span>
        </div>
        <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
      </div>

      {/* Rank */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">Rank:</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">{rank.icon}</span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {rank.title}
          </span>
        </div>
      </div>

      {/* Recent Catches */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Recent Catches:
        </h3>
        <div className="flex gap-1 flex-wrap">
          {catches.slice(-5).map((fish, index) => (
            <div
              key={index}
              className="text-2xl transform hover:scale-110 transition-transform"
              title={`${fish.points} points`}
            >
              {fish.emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}