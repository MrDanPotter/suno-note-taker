import React, { useMemo, useState, useEffect } from "react";
import { Song, CategoryNote, SortMode } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmptyState } from './components/EmptyState';
import { SectionHeader } from './components/SectionHeader';
import { SongCard } from './components/SongCard';
import { AddSongModal } from './components/AddSongModal';
import { GettingStartedModal } from './components/GettingStartedModal';
import { 
  LS_KEY, 
  parseSunoInput, 
  calcSongScore, 
  uuid, 
  runInlineTests,
  migrateOldNotes
} from './utils';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>(() => {
    try { 
      const saved = localStorage.getItem(LS_KEY + ":sort"); 
      if (saved) return saved as SortMode; 
    } catch {} 
    return "total"; // or "average"
  });
  const [isSorted, setIsSorted] = useState(false);

  // Run inline tests on mount
  useEffect(() => {
    runInlineTests();
  }, []);

  // Load songs from localStorage with migration
  useEffect(() => { 
    try { 
      const saved = localStorage.getItem(LS_KEY); 
      if (saved) {
        const parsedSongs = JSON.parse(saved);
        // Migrate old songs to new format
        const migratedSongs = parsedSongs.map((song: any) => migrateOldNotes(song));
        setSongs(migratedSongs);
      }
    } catch {} 
  }, []);

  // Save songs to localStorage
  useEffect(() => { 
    try { 
      localStorage.setItem(LS_KEY, JSON.stringify(songs)); 
    } catch {} 
  }, [songs]);

  // Save sort mode to localStorage
  useEffect(() => { 
    try { 
      localStorage.setItem(LS_KEY + ":sort", sortMode); 
    } catch {} 
  }, [sortMode]);

  // Get sorted songs only when explicitly requested
  const sortedSongs = useMemo(() => {
    if (!isSorted) return songs;
    
    const withScores = songs.map(s => ({ song: s, ...calcSongScore(s) }));
    
    if (sortMode === "average") {
      withScores.sort((a, b) => 
        b.average - a.average || b.total - a.total || b.count - a.count
      );
    } else {
      withScores.sort((a, b) => 
        b.total - a.total || b.average - a.average || b.count - a.count
      );
    }
    
    return withScores.map(x => x.song);
  }, [songs, sortMode, isSorted]);

  // Handle manual sorting
  const handleSort = () => {
    setIsSorted(true);
  };

  // Reset sorting when songs change
  useEffect(() => {
    setIsSorted(false);
  }, [songs]);

  function addSongFromInput(input: { paste: string }) {
    setError(null);
    const parsed = parseSunoInput(input.paste);
    
    if (!parsed) { 
      setError("Couldn't recognize that as a Suno embed. Please copy the full iframe code from Suno's share menu (Share → Share to... → Embed → Copy)."); 
      return; 
    }
    
    if (songs.some(s => s.id === parsed.id)) { 
      setError("That song is already added."); 
      return; 
    }
    
    const newSong: Song = { 
      id: parsed.id, 
      embedSrc: parsed.embedSrc, 
      originalInput: input.paste.trim(), 
      categoryNotes: [] 
    };
    
    setSongs(prev => [newSong, ...prev]); 
    setShowAdd(false);
  }

  function handleAddCategoryNote(songId: string, note: Omit<CategoryNote, 'id' | 'createdAt'>) { 
    setSongs(prev => prev.map(s => 
      s.id === songId 
        ? { ...s, categoryNotes: [...(s.categoryNotes || []), { id: uuid(), createdAt: Date.now(), ...note }] } 
        : s
    )); 
  }

  function handleDeleteCategoryNote(songId: string, noteId: string) { 
    setSongs(prev => prev.map(s => 
      s.id === songId 
        ? { ...s, categoryNotes: (s.categoryNotes || []).filter(n => n.id !== noteId) } 
        : s
    )); 
  }

  function handleRemoveSong(songId: string) { 
    setSongs(prev => prev.filter(s => s.id !== songId)); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Header 
        onShowAdd={() => setShowAdd(true)} 
        onShowGettingStarted={() => setShowGettingStarted(true)} 
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {songs.length === 0 && <EmptyState />}

        {songs.length > 0 && (
          <>
            <SectionHeader
              title="Songs"
              count={songs.length}
              right={
                <div className="flex items-center gap-2 text-sm">
                  <label className="text-gray-600">Sort by</label>
                  <select 
                    className="border rounded-lg px-2 py-1" 
                    value={sortMode} 
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                  >
                    <option value="total">Total (desc)</option>
                    <option value="average">Average (desc)</option>
                  </select>
                  <button 
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    onClick={handleSort}
                  >
                    {isSorted ? 'Re-sort' : 'Sort'}
                  </button>
                </div>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(isSorted ? sortedSongs : songs).map(s => (
                <SongCard 
                  key={s.id} 
                  song={s} 
                  onAddCategoryNote={handleAddCategoryNote} 
                  onDeleteCategoryNote={handleDeleteCategoryNote} 
                  onRemoveSong={handleRemoveSong} 
                />
              ))}
            </div>
          </>
        )}
      </main>

      <AddSongModal 
        isOpen={showAdd} 
        onClose={() => setShowAdd(false)} 
        onAddSong={addSongFromInput} 
        error={error} 
      />

      <GettingStartedModal 
        isOpen={showGettingStarted} 
        onClose={() => setShowGettingStarted(false)} 
      />

      <Footer />
    </div>
  );
}

export default App;
