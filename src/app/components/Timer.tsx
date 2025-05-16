import React from "react";

interface TimerProps {
  timeLeft: number;
}

export function Timer({ timeLeft }: TimerProps) {
  return (
    <div className="text-2xl font-mono text-center">
      Time Left: <span className="font-bold">{timeLeft}s</span>
    </div>
  );
}
