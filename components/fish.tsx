"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface FishData {
  emoji: string;
  points: number;
  speed: number;
  rarity: number;
}

const FISH_TYPES: FishData[] = [
  { emoji: "🐟", points: 1, speed: 2, rarity: 1 },
  { emoji: "🐠", points: 2, speed: 3, rarity: 0.8 },
  { emoji: "🐡", points: 3, speed: 1, rarity: 0.6 },
  { emoji: "🦈", points: 5, speed: 4, rarity: 0.3 },
  { emoji: "🐋", points: 10, speed: 1, rarity: 0.1 },
];

interface FishProps {
  emoji: string;
  speed: number;
  position: number;
  depth: number;
}

const FishComponent = ({ emoji, speed, position, depth }: FishProps) => {
  const [pos, setPos] = useState(position);
  const direction = speed > 0 ? "" : "scale-x-[-1]";

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((prev) => {
        const newPos = prev + speed;
        return newPos > 100 ? -20 : newPos;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div
      className={cn(
        "absolute transition-all duration-50 transform hover:scale-110",
        direction,
        pos < -10 && "opacity-0"
      )}
      style={{
        left: `${pos}%`,
        top: `${depth}%`,
        transform: `${direction} rotate(${speed > 0 ? 0 : 180}deg)`,
      }}
    >
      <span className="text-2xl select-none">{emoji}</span>
    </div>
  );
};

export function Fish() {
  const [fishInstances, setFishInstances] = useState<Array<{
    id: number;
    type: FishData;
    depth: number;
    startPosition: number;
    speedMultiplier: number;
  }>>([]);

  useEffect(() => {
    const generateFish = () => {
      const newFish = [];
      let id = 0;

      for (const fishType of FISH_TYPES) {
        const instances = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < instances; i++) {
          if (Math.random() < fishType.rarity) {
            newFish.push({
              id: id++,
              type: fishType,
              depth: Math.random() * 60 + 20, // Keep fish between 20% and 80% of height
              startPosition: -(Math.random() * 100),
              speedMultiplier: Math.random() * 0.5 + 0.75, // Speed variation
            });
          }
        }
      }
      return newFish;
    };

    setFishInstances(generateFish());

    const interval = setInterval(() => {
      setFishInstances(generateFish());
    }, 10000); // Regenerate fish every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {fishInstances.map(({ id, type, depth, startPosition, speedMultiplier }) => (
        <FishComponent
          key={id}
          emoji={type.emoji}
          speed={type.speed * speedMultiplier}
          position={startPosition}
          depth={depth}
        />
      ))}
    </div>
  );
}