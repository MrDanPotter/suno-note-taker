import React, { useState, useEffect } from 'react';
import { NoteCategory, CategoryNote } from '../types';
import { CATEGORY_LABELS } from '../utils';

interface CategoryRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: Omit<CategoryNote, 'id' | 'createdAt'>) => void;
  category: NoteCategory;
  verseNumber?: number;
  bridgeNumber?: number;
}

export const CategoryRatingModal: React.FC<CategoryRatingModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  category,
  verseNumber,
  bridgeNumber
}) => {
  const [score, setScore] = useState(0);

  // Reset score when modal opens
  useEffect(() => {
    if (isOpen) {
      setScore(0);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const note: Omit<CategoryNote, 'id' | 'createdAt'> = {
      category,
      score,
      ...(verseNumber && { verseNumber }),
      ...(bridgeNumber && { bridgeNumber })
    };
    
    onAddNote(note);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          Rate {getCategoryLabel()}
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Score: {score}/5
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            onKeyDown={handleKeyDown}
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

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Rating
          </button>
        </div>
      </div>
    </div>
  );
};
