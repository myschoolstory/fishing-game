"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FishingHook } from "lucide-react";

interface RodProps {
  onCatch: (position: { x: number; y: number }) => void;
}

export function Rod({ onCatch }: RodProps) {
  const [casting, setCasting] = useState(false);
  const [linePosition, setLinePosition] = useState({ x: 50, y: 0 });
  const [reeling, setReeling] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (casting) {
        const container = document.getElementById("fishing-area");
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setLinePosition({ 
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [casting]);

  const handleCast = () => {
    if (!casting && !reeling) {
      setCasting(true);
    }
  };

  const handleReel = () => {
    if (casting && !reeling) {
      setReeling(true);
      onCatch(linePosition);
      
      // Animate the line coming back up
      const startY = linePosition.y;
      let progress = 0;
      
      const reelInterval = setInterval(() => {
        progress += 0.05;
        if (progress >= 1) {
          clearInterval(reelInterval);
          setCasting(false);
          setReeling(false);
          setLinePosition(prev => ({ ...prev, y: 0 }));
        } else {
          setLinePosition(prev => ({
            ...prev,
            y: startY * (1 - progress)
          }));
        }
      }, 20);
    }
  };

  return (
    <div className="absolute w-full h-full pointer-events-none">
      {/* Fishing Rod Handle */}
      <div className="absolute right-0 top-0 w-20 h-40 flex items-start justify-center">
        <div className="w-4 h-32 bg-amber-800 rounded-full" />
      </div>

      {/* Fishing Line */}
      <div
        className={cn(
          "absolute right-10 top-8",
          "pointer-events-none",
          casting && "transition-all duration-200"
        )}
        style={{
          width: "2px",
          height: `${linePosition.y}%`,
          background: "linear-gradient(to bottom, #666, #999)",
          transformOrigin: "top",
          transform: `
            translateX(-${100 - linePosition.x}%) 
            rotate(${(linePosition.x - 50) * 0.2}deg)
          `,
        }}
      >
        {/* Hook */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <FishingHook className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute right-4 top-44 space-y-2 pointer-events-auto">
        <button
          onClick={handleCast}
          disabled={casting || reeling}
          className={cn(
            "px-4 py-2 rounded-lg text-white font-semibold",
            !casting && !reeling 
              ? "bg-blue-500 hover:bg-blue-600" 
              : "bg-blue-300 cursor-not-allowed"
          )}
        >
          Cast
        </button>
        <button
          onClick={handleReel}
          disabled={!casting || reeling}
          className={cn(
            "px-4 py-2 rounded-lg text-white font-semibold block",
            casting && !reeling 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-green-300 cursor-not-allowed"
          )}
        >
          Reel
        </button>
      </div>
    </div>
  );
}