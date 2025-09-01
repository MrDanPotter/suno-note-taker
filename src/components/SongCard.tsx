import React, { useMemo, useCallback } from 'react';
import { Song, CategoryNote, NoteCategory } from '../types';

import { CategoryRating } from './CategoryRating';
import { calcSongScore, NOTE_CATEGORIES, CATEGORY_LABELS, getNextVerseNumber, getNextBridgeNumber } from '../utils';

interface SongCardProps {
  song: Song;
  onAddCategoryNote: (songId: string, note: Omit<CategoryNote, 'id' | 'createdAt'>) => void;
  onUpdateCategoryNote: (songId: string, noteId: string, updatedNote: Omit<CategoryNote, 'id' | 'createdAt'>) => void;
  onDeleteCategoryNote: (songId: string, noteId: string) => void;
  onRemoveSong: (songId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onAddCategoryNote, 
  onUpdateCategoryNote, 
  onDeleteCategoryNote, 
  onRemoveSong 
}) => {
  const { average, count } = useMemo(() => calcSongScore(song), [song]);

  // Memoize handlers to prevent unnecessary re-renders
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

    // Add a new note with default score 0
    const note: Omit<CategoryNote, 'id' | 'createdAt'> = {
      category,
      score: 0,
      ...(verseNumber && { verseNumber }),
      ...(bridgeNumber && { bridgeNumber })
    };
    
    onAddCategoryNote(song.id, note);
  }, [song, onAddCategoryNote]);

  const handleScoreChange = useCallback((category: NoteCategory, newScore: number, verseNumber?: number, bridgeNumber?: number) => {
    // Find existing note for this category
    const existingNote = song.categoryNotes.find(note => {
      if (note.category !== category) return false;
      if (category === 'verse' && verseNumber) {
        return note.verseNumber === verseNumber;
      }
      if (category === 'bridge' && bridgeNumber) {
        return note.bridgeNumber === bridgeNumber;
      }
      return true;
    });

    if (existingNote) {
      // Update existing note
      const updatedNote: Omit<CategoryNote, 'id' | 'createdAt'> = {
        ...existingNote,
        score: newScore
      };
      onUpdateCategoryNote(song.id, existingNote.id, updatedNote);
    }
  }, [song.categoryNotes, onUpdateCategoryNote, song.id]);

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

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500 break-all">{song.id}</div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-blue-900">
              Overall Score: {average.toFixed(2)}/5
            </div>
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

      {/* Category ratings */}
      <div className="px-4 py-3">
        {/* Category buttons area */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Add Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {NOTE_CATEGORIES.map(category => {
              const notes = notesByCategory.get(category) || [];
              const isCompleted = notes.length > 0;
              
              // For verse and bridge, show button if no notes exist
              if (category === 'verse' || category === 'bridge') {
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                    title={`Add ${CATEGORY_LABELS[category]} rating`}
                  >
                    + {CATEGORY_LABELS[category]}
                  </button>
                );
              }
              
              // For other categories, only show button if not completed
              if (!isCompleted) {
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                    title={`Add ${CATEGORY_LABELS[category]} rating`}
                  >
                    + {CATEGORY_LABELS[category]}
                  </button>
                );
              }
              
              return null; // Don't show button for completed non-verse/bridge categories
            })}
          </div>
        </div>

        {/* Ratings area */}
        {song.categoryNotes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Category Ratings</h3>
            <div className="space-y-2">
              {NOTE_CATEGORIES.map(category => {
                const notes = notesByCategory.get(category) || [];
                
                if (notes.length === 0) {
                  return null; // Don't render anything for unrated categories
                }

                // For verse and bridge, show multiple ratings if they exist
                if (category === 'verse' || category === 'bridge') {
                  const groupedNotes = new Map<number, CategoryNote[]>();
                  notes.forEach(note => {
                    const number = category === 'verse' ? note.verseNumber || 1 : note.bridgeNumber || 1;
                    if (!groupedNotes.has(number)) {
                      groupedNotes.set(number, []);
                    }
                    groupedNotes.get(number)!.push(note);
                  });

                  return Array.from(groupedNotes.entries()).map(([number, categoryNotes]) => {
                    const note = categoryNotes[0]; // Take the first note for this number
                    return (
                      <CategoryRating
                        key={`${category}-${number}`}
                        category={category}
                        currentScore={note.score}
                        onScoreChange={(newScore: number) => handleScoreChange(category, newScore, number, undefined)}
                        onDelete={() => handleDeleteCategoryNote(note.id)}
                        verseNumber={category === 'verse' ? number : undefined}
                        bridgeNumber={category === 'bridge' ? number : undefined}
                      />
                    );
                  });
                }

                // For other categories, show single rating
                const note = notes[0];
                return (
                  <CategoryRating
                    key={category}
                    category={category}
                    currentScore={note.score}
                    onScoreChange={(newScore: number) => handleScoreChange(category, newScore)}
                    onDelete={() => handleDeleteCategoryNote(note.id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
