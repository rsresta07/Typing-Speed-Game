import React from "react";

interface AccuracyMeterProps {
  accuracy: number; // 0 - 100
}

export function AccuracyMeter({ accuracy }: AccuracyMeterProps) {
  // Color changes based on accuracy level
  let colorClass = "bg-green-500";
  if (accuracy < 70) colorClass = "bg-red-500";
  else if (accuracy < 90) colorClass = "bg-yellow-400";

  return (
    <div className="w-full bg-gray-300 rounded h-4">
      <div
        className={`${colorClass} h-4 rounded transition-all duration-300`}
        style={{ width: `${accuracy}%` }}
      />
    </div>
  );
}
