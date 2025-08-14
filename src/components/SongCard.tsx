import React, { useMemo, useState, useCallback } from 'react';
import { Song, Note } from '../types';
import { ScorePill } from './ScorePill';
import { PMCount } from './PMCount';
import { calcSongScore, clampScore } from '../utils';

interface SongCardProps {
  song: Song;
  onAddNote: (songId: string, note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (songId: string, noteId: string) => void;
  onRemoveSong: (songId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onAddNote, 
  onDeleteNote, 
  onRemoveSong 
}) => {
  const { total, plus, minus, count, average } = useMemo(() => calcSongScore(song), [song]);
  const [text, setText] = useState("");
  const [score, setScore] = useState<0 | 1 | -1 | 2 | -2>(0);

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddNote = useCallback(() => {
    if (!text.trim()) return;
    onAddNote(song.id, { text: text.trim(), score });
    setText("");
  }, [text, score, song.id, onAddNote]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text.trim()) {
      handleAddNote();
    }
  }, [text, handleAddNote]);

  const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setScore(clampScore(parseInt(e.target.value)));
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleRemoveSong = useCallback(() => {
    onRemoveSong(song.id);
  }, [song.id, onRemoveSong]);

  const handleDeleteNote = useCallback((noteId: string) => {
    onDeleteNote(song.id, noteId);
  }, [song.id, onDeleteNote]);

  // Memoize the iframe to prevent re-rendering
  const songIframe = useMemo(() => (
    <iframe 
      title={`Suno ${song.id}`} 
      src={song.embedSrc} 
      className="w-full h-full" 
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
    />
  ), [song.id, song.embedSrc]);

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500 break-all">{song.id}</div>
          <div className="flex items-center gap-2">
            <ScorePill total={total} average={average} />
            <PMCount plus={plus} minus={minus} count={count} />
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

      {/* Notes list */}
      <div className="px-4 py-3">
        {song.notes.length === 0 ? (
          <div className="text-sm text-gray-500 mb-3">
            No notes yet. Add your first impression below.
          </div>
        ) : (
          <ul className="space-y-2 mb-4">
            {song.notes.map(n => (
              <li key={n.id} className="flex items-start gap-3">
                <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                  n.score > 0 
                    ? "bg-green-100 text-green-800" 
                    : n.score < 0 
                    ? "bg-red-100 text-red-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {n.score > 0 ? `+${n.score}` : n.score}
                </span>
                <div className="flex-1">
                  <div className="text-sm leading-snug">{n.text}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteNote(n.id)} 
                  className="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add note form */}
        <div className="flex items-center gap-2">
          <select 
            className="border rounded-lg text-sm px-2 py-1" 
            value={score} 
            onChange={handleScoreChange}
          >
            <option value={2}>+2</option>
            <option value={1}>+1</option>
            <option value={0}>0</option>
            <option value={-1}>-1</option>
            <option value={-2}>-2</option>
          </select>
          <input 
            className="flex-1 border rounded-lg text-sm px-3 py-2" 
            placeholder={'Write a quick note (e.g., "hook slaps")'} 
            value={text} 
            onChange={handleTextChange} 
            onKeyDown={handleKeyDown}
          />
          <button 
            className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" 
            onClick={handleAddNote}
          >
            Add note
          </button>
        </div>
      </div>
    </div>
  );
};
