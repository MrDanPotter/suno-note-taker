import React from 'react';

interface ScorePillProps {
  total: number;
  average: number;
}

export const ScorePill: React.FC<ScorePillProps> = ({ total, average }) => {
  const color = total > 0 
    ? "bg-green-100 text-green-800" 
    : total < 0 
    ? "bg-red-100 text-red-800" 
    : "bg-gray-100 text-gray-800";
  
  const totalStr = total.toFixed(2);
  const avgStr = (average >= 0 ? "+" : "") + average.toFixed(2);
  
  return (
    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <span>Σ {totalStr}</span>
      <span className="opacity-70">·</span>
      <span>avg {avgStr}</span>
    </span>
  );
};
