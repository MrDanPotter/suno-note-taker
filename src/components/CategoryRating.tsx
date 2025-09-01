import React, { useState, useEffect } from 'react';
import { NoteCategory } from '../types';
import { CATEGORY_LABELS } from '../utils';

interface CategoryRatingProps {
  category: NoteCategory;
  currentScore: number;
  onScoreChange: (score: number) => void;
  onDelete: () => void;
  verseNumber?: number;
  bridgeNumber?: number;
}

export const CategoryRating: React.FC<CategoryRatingProps> = ({
  category,
  currentScore,
  onScoreChange,
  onDelete,
  verseNumber,
  bridgeNumber
}) => {
  const [score, setScore] = useState(currentScore);

  // Update local state when prop changes
  useEffect(() => {
    setScore(currentScore);
  }, [currentScore]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseFloat(e.target.value);
    setScore(newScore);
    onScoreChange(newScore);
  };

  const getCategoryLabel = () => {
    let label = CATEGORY_LABELS[category];
    if (category === 'verse' && verseNumber) {
      label = `Verse ${verseNumber}`;
    } else if (category === 'bridge' && bridgeNumber) {
      label = `Bridge ${bridgeNumber}`;
    }
    return label;
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
      {/* Score display */}
      <div className="text-sm font-semibold text-gray-900 min-w-[3rem] text-center">
        {score.toFixed(1)}
      </div>
      
      {/* Category label */}
      <div className="text-sm font-medium text-gray-700 min-w-[5rem]">
        {getCategoryLabel()}
      </div>
      
      {/* Slider */}
      <div className="flex-1 min-w-0">
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={score}
          onChange={handleScoreChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
      
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 flex-shrink-0"
        title="Delete rating"
      >
        ×
      </button>
    </div>
  );
};
