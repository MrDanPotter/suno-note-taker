export type NoteCategory = 'intro' | 'verse' | 'bridge' | 'chorus' | 'outro' | 'vocals' | 'timing' | 'overall_vibe';

export interface CategoryNote {
  id: string;
  category: NoteCategory;
  score: number; // 0-5
  createdAt: number;
  verseNumber?: number; // For verse and bridge categories
  bridgeNumber?: number; // For bridge category
}

export interface Song {
  id: string;
  embedSrc: string;
  originalInput: string;
  categoryNotes: CategoryNote[];
}

export interface SongScore {
  total: number;
  average: number;
  count: number;
  categoryScores: Record<NoteCategory, number>;
  completedCategories: NoteCategory[];
}

export interface ParsedSunoInput {
  id: string;
  embedSrc: string;
}

export type SortMode = 'total' | 'average';

// Legacy support - keeping old Note interface for migration
export interface Note {
  id: string;
  text: string;
  score: -2 | -1 | 0 | 1 | 2;
  createdAt: number;
}
