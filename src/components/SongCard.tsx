import React, { useMemo, useState, useCallback } from 'react';
import { Song, CategoryNote, NoteCategory } from '../types';
import { ScorePill } from './ScorePill';
import { CategoryRatingModal } from './CategoryRatingModal';
import { calcSongScore, NOTE_CATEGORIES, CATEGORY_LABELS, getNextVerseNumber, getNextBridgeNumber } from '../utils';

interface SongCardProps {
  song: Song;
  onAddCategoryNote: (songId: string, note: Omit<CategoryNote, 'id' | 'createdAt'>) => void;
  onDeleteCategoryNote: (songId: string, noteId: string) => void;
  onRemoveSong: (songId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onAddCategoryNote, 
  onDeleteCategoryNote, 
  onRemoveSong 
}) => {
  const { total, average, count, categoryScores, completedCategories } = useMemo(() => calcSongScore(song), [song]);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    category: NoteCategory;
    verseNumber?: number;
    bridgeNumber?: number;
  }>({
    isOpen: false,
    category: 'intro'
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddCategoryNote = useCallback((note: Omit<CategoryNote, 'id' | 'createdAt'>) => {
    onAddCategoryNote(song.id, note);
  }, [song.id, onAddCategoryNote]);

  const handleRemoveSong = useCallback(() => {
    onRemoveSong(song.id);
  }, [song.id, onRemoveSong]);

  const handleDeleteCategoryNote = useCallback((noteId: string) => {
    onDeleteCategoryNote(song.id, noteId);
  }, [song.id, onDeleteCategoryNote]);

  const handleCategoryClick = useCallback((category: NoteCategory) => {
    let verseNumber: number | undefined;
    let bridgeNumber: number | undefined;

    if (category === 'verse') {
      verseNumber = getNextVerseNumber(song);
    } else if (category === 'bridge') {
      bridgeNumber = getNextBridgeNumber(song);
    }

    setRatingModal({
      isOpen: true,
      category,
      verseNumber,
      bridgeNumber
    });
  }, [song]);

  const closeRatingModal = useCallback(() => {
    setRatingModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Memoize the iframe to prevent re-rendering
  const songIframe = useMemo(() => (
    <iframe 
      title={`Suno ${song.id}`} 
      src={song.embedSrc} 
      className="w-full h-full" 
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
    />
  ), [song.id, song.embedSrc]);

  // Get notes grouped by category for display
  const notesByCategory = useMemo(() => {
    const grouped = new Map<NoteCategory, CategoryNote[]>();
    NOTE_CATEGORIES.forEach(category => {
      grouped.set(category, []);
    });

    song.categoryNotes.forEach(note => {
      const existing = grouped.get(note.category) || [];
      grouped.set(note.category, [...existing, note]);
    });

    return grouped;
  }, [song.categoryNotes]);

  const isCategoryCompleted = (category: NoteCategory): boolean => {
    return completedCategories.includes(category);
  };

  const getCategoryButtonLabel = (category: NoteCategory): string => {
    const baseLabel = CATEGORY_LABELS[category];
    const notes = notesByCategory.get(category) || [];
    
    if (category === 'verse' || category === 'bridge') {
      const numbers = notes.map(note => 
        category === 'verse' ? note.verseNumber || 1 : note.bridgeNumber || 1
      );
      const uniqueNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);
      if (uniqueNumbers.length > 0) {
        return `${baseLabel} ${uniqueNumbers.join(', ')}`;
      }
    }
    
    return baseLabel;
  };

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500 break-all">{song.id}</div>
          <div className="flex items-center gap-2">
            <ScorePill total={total} average={average} />
            <div className="text-xs text-gray-500">
              {count} categories rated
            </div>
          </div>
        </div>
        <button 
          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200" 
          onClick={handleRemoveSong} 
          title="Remove song"
        >
          Remove
        </button>
      </div>

      {/* Player - Memoized to prevent re-rendering */}
      <div className="aspect-[19/6] w-full">
        {songIframe}
      </div>

      {/* Category buttons */}
      <div className="px-4 py-3">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rate Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {NOTE_CATEGORIES.map(category => {
              const isCompleted = isCategoryCompleted(category);
              const notes = notesByCategory.get(category) || [];
              const latestNote = notes.sort((a, b) => b.createdAt - a.createdAt)[0];
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  disabled={isCompleted && category !== 'verse' && category !== 'bridge'}
                  className={`
                    text-xs px-3 py-2 rounded-lg border transition-colors
                    ${isCompleted 
                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }
                    ${(category === 'verse' || category === 'bridge') ? '' : 'disabled:opacity-50 disabled:cursor-not-allowed'}
                  `}
                  title={isCompleted ? `Rated: ${latestNote?.score}/5` : `Rate ${CATEGORY_LABELS[category]}`}
                >
                  <div className="font-medium">{getCategoryButtonLabel(category)}</div>
                  {isCompleted && (
                    <div className="text-xs opacity-75">{latestNote?.score}/5</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category scores display */}
        {completedCategories.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Category Scores</h3>
            <div className="grid grid-cols-2 gap-2">
              {completedCategories.map(category => {
                const score = categoryScores[category];
                const notes = notesByCategory.get(category) || [];
                
                return (
                  <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">
                      {CATEGORY_LABELS[category]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-900">{score.toFixed(1)}/5</span>
                      <button
                        onClick={() => {
                          const latestNote = notes.sort((a, b) => b.createdAt - a.createdAt)[0];
                          if (latestNote) {
                            handleDeleteCategoryNote(latestNote.id);
                          }
                        }}
                        className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 hover:bg-red-200"
                        title="Delete rating"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Overall score */}
        {completedCategories.length > 0 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900">
              Overall Score: {average.toFixed(1)}/5
            </div>
            <div className="text-xs text-blue-700">
              Based on {count} categories
            </div>
          </div>
        )}
      </div>

      <CategoryRatingModal
        isOpen={ratingModal.isOpen}
        onClose={closeRatingModal}
        onAddNote={handleAddCategoryNote}
        category={ratingModal.category}
        verseNumber={ratingModal.verseNumber}
        bridgeNumber={ratingModal.bridgeNumber}
      />
    </div>
  );
};
