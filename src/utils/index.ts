import { Song, SongScore, ParsedSunoInput, NoteCategory } from '../types';

export const LS_KEY = "suno-comparator-v4"; // Updated version for new system

export const NOTE_CATEGORIES: NoteCategory[] = [
  'intro', 'verse', 'bridge', 'chorus', 'outro', 'vocals', 'timing', 'overall_vibe'
];

export const CATEGORY_LABELS: Record<NoteCategory, string> = {
  intro: 'Intro',
  verse: 'Verse',
  bridge: 'Bridge', 
  chorus: 'Chorus',
  outro: 'Outro',
  vocals: 'Vocals',
  timing: 'Timing',
  overall_vibe: 'Overall Vibe'
};

export function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function clampScore(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n * 10) / 10));
}

// Accepts: full <iframe ...>, an embed URL, a song URL, or a raw 36-char id
export function parseSunoInput(input: string): ParsedSunoInput | null {
  const trimmed = (input || "").trim();
  if (!trimmed) return null;
  
  // First, try to extract src from iframe
  const iframeSrcMatch = trimmed.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
  const candidate = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;
  
  // Try to extract ID from various Suno URL patterns
  // Look for 36-character hex IDs in the URL
  const idMatch = candidate.match(/([a-f0-9-]{36})/i);
  if (idMatch) {
    const id = idMatch[1];
    return { id, embedSrc: `https://suno.com/embed/${id}` };
  }
  
  return null;
}

export function calcSongScore(song: Song): SongScore {
  const categoryNotes = song.categoryNotes || [];
  
  // Initialize category scores to 0
  const categoryScores: Record<NoteCategory, number> = {
    intro: 0,
    verse: 0,
    bridge: 0,
    chorus: 0,
    outro: 0,
    vocals: 0,
    timing: 0,
    overall_vibe: 0
  };
  
  const completedCategories: NoteCategory[] = [];
  let totalCategoryCount = 0; // Count each individual category instance
  let totalIndividualScore = 0; // Sum of all individual scores
  
  // Calculate scores for each category
  NOTE_CATEGORIES.forEach(category => {
    const notesForCategory = categoryNotes.filter(note => note.category === category);
    
    if (notesForCategory.length > 0) {
      // For verse and bridge, we need to handle multiple instances
      if (category === 'verse' || category === 'bridge') {
        // Calculate average of all individual scores across all verses/bridges
        const totalScore = notesForCategory.reduce((sum, note) => sum + note.score, 0);
        const totalCount = notesForCategory.length;
        
        categoryScores[category] = totalCount > 0 ? totalScore / totalCount : 0;
        completedCategories.push(category);
        totalCategoryCount += totalCount; // Count each individual verse/bridge
        totalIndividualScore += totalScore; // Add sum of individual scores
      } else {
        // For other categories, just take the latest score
        const latestNote = notesForCategory.sort((a, b) => b.createdAt - a.createdAt)[0];
        categoryScores[category] = latestNote.score;
        completedCategories.push(category);
        totalCategoryCount += 1; // Count as one category
        totalIndividualScore += latestNote.score; // Add individual score
      }
    }
  });
  
  // Calculate total and average from individual scores, not category averages
  const total = totalIndividualScore; // Use sum of all individual scores
  const count = totalCategoryCount; // Use the total count of individual instances
  const average = count > 0 ? total / count : 0;
  
  return { 
    total, 
    average, 
    count, 
    categoryScores, 
    completedCategories 
  };
}

// Helper function to get next verse/bridge number
export function getNextVerseNumber(song: Song): number {
  const verseNotes = song.categoryNotes.filter(note => note.category === 'verse');
  if (verseNotes.length === 0) return 1;
  
  const maxVerseNumber = Math.max(...verseNotes.map(note => note.verseNumber || 1));
  return maxVerseNumber + 1;
}

export function getNextBridgeNumber(song: Song): number {
  const bridgeNotes = song.categoryNotes.filter(note => note.category === 'bridge');
  if (bridgeNotes.length === 0) return 1;
  
  const maxBridgeNumber = Math.max(...bridgeNotes.map(note => note.bridgeNumber || 1));
  return maxBridgeNumber + 1;
}

// Migration function to convert old notes to new system
export function migrateOldNotes(song: any): Song {
  if (song.notes && Array.isArray(song.notes)) {
    // Convert old notes to new system
    const categoryNotes = song.notes.map((note: any) => ({
      id: note.id,
      category: 'overall_vibe' as NoteCategory, // Default to overall vibe
      score: Math.max(0, note.score + 2), // Convert -2 to +2 scale to 0-5 scale
      createdAt: note.createdAt
    }));
    
    return {
      ...song,
      categoryNotes,
      notes: undefined // Remove old notes
    };
  }
  
  return song;
}

// Inline tests for parseSunoInput and calcSongScore
export function runInlineTests(): void {
  // parse tests
  const exIframe = '<iframe src="..." width="760" height="240"></iframe>';
  const exEmbed = '...';
  const exSong = '...';
  const exRaw = '...';
  const exBad = '...';
  
  try {
    const t1 = parseSunoInput(exIframe);
    const t2 = parseSunoInput(exEmbed);
    const t3 = parseSunoInput(exSong);
    const t4 = parseSunoInput(exRaw);
    const t5 = parseSunoInput(exBad);
    
    console.assert(t1 && t1.id === '...', 'iframe parse failed');
    console.assert(t2 && t2.id === '...', 'embed URL parse failed');
    console.assert(t3 && t3.id === '...', 'song URL parse failed');
    console.assert(t4 && t4.id === '...', 'raw id parse failed');
    console.assert(t5 === null, 'bad URL should be null');
  } catch (e) {
    console.warn('Parse tests threw (non-fatal):', e);
  }

  // score tests for new system
  const s1: Song = { 
    id: 'test1', 
    embedSrc: '', 
    originalInput: '', 
    categoryNotes: [
      { id: '1', category: 'intro', score: 4, createdAt: 0 },
      { id: '2', category: 'chorus', score: 5, createdAt: 0 },
      { id: '3', category: 'vocals', score: 3, createdAt: 0 }
    ] 
  };
  const s2: Song = { id: 'test2', embedSrc: '', originalInput: '', categoryNotes: [] };
  
  const r1 = calcSongScore(s1); // total 12, avg 4
  const r2 = calcSongScore(s2); // total 0, avg 0
  
  console.assert(r1.total === 12 && r1.average === 4, 'calcSongScore totals/avg failed');
  console.assert(r2.total === 0 && r2.average === 0, 'calcSongScore empty failed');

  // Test single category scoring
  const s3: Song = {
    id: 'test3',
    embedSrc: '',
    originalInput: '',
    categoryNotes: [
      { id: '1', category: 'intro', score: 4.5, createdAt: 0 }
    ]
  };
  const r3 = calcSongScore(s3);
  console.assert(r3.average === 4.5, 'Single category scoring failed - expected 4.5, got ' + r3.average);

  // Test verse scoring
  const s4: Song = {
    id: 'test4',
    embedSrc: '',
    originalInput: '',
    categoryNotes: [
      { id: '1', category: 'verse', score: 3.0, verseNumber: 1, createdAt: 0 }
    ]
  };
  const r4 = calcSongScore(s4);
  console.assert(r4.average === 3.0, 'Single verse scoring failed - expected 3.0, got ' + r4.average);

  // Test multiple verses counting
  const s5: Song = {
    id: 'test5',
    embedSrc: '',
    originalInput: '',
    categoryNotes: [
      { id: '1', category: 'verse', score: 3.0, verseNumber: 1, createdAt: 0 },
      { id: '2', category: 'verse', score: 4.0, verseNumber: 2, createdAt: 0 },
      { id: '3', category: 'verse', score: 5.0, verseNumber: 3, createdAt: 0 }
    ]
  };
  const r5 = calcSongScore(s5);
  console.assert(r5.count === 3, 'Multiple verses count failed - expected 3, got ' + r5.count);
  console.assert(r5.average === 4.0, 'Multiple verses average failed - expected 4.0, got ' + r5.average);
  console.assert(r5.total === 12.0, 'Multiple verses total failed - expected 12.0, got ' + r5.total);

  // Test mixed categories counting
  const s6: Song = {
    id: 'test6',
    embedSrc: '',
    originalInput: '',
    categoryNotes: [
      { id: '1', category: 'intro', score: 4.0, createdAt: 0 },
      { id: '2', category: 'verse', score: 3.0, verseNumber: 1, createdAt: 0 },
      { id: '3', category: 'verse', score: 5.0, verseNumber: 2, createdAt: 0 },
      { id: '4', category: 'chorus', score: 4.5, createdAt: 0 }
    ]
  };
  const r6 = calcSongScore(s6);
  console.assert(r6.count === 4, 'Mixed categories count failed - expected 4, got ' + r6.count);
  console.assert(Math.abs(r6.average - 4.125) < 0.001, 'Mixed categories average failed - expected 4.125, got ' + r6.average);
  console.assert(r6.total === 16.5, 'Mixed categories total failed - expected 16.5, got ' + r6.total);

  // Test bridge scoring specifically
  const s7: Song = {
    id: 'test7',
    embedSrc: '',
    originalInput: '',
    categoryNotes: [
      { id: '1', category: 'bridge', score: 5.0, bridgeNumber: 1, createdAt: 0 },
      { id: '2', category: 'bridge', score: 5.0, bridgeNumber: 2, createdAt: 0 }
    ]
  };
  const r7 = calcSongScore(s7);
  console.assert(r7.count === 2, 'Bridge count failed - expected 2, got ' + r7.count);
  console.assert(r7.average === 5.0, 'Bridge average failed - expected 5.0, got ' + r7.average);
  console.assert(r7.total === 10.0, 'Bridge total failed - expected 10.0, got ' + r7.total);
}
