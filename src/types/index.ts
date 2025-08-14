export interface Note {
  id: string;
  text: string;
  score: -2 | -1 | 0 | 1 | 2;
  createdAt: number;
}

export interface Song {
  id: string;
  embedSrc: string;
  originalInput: string;
  notes: Note[];
}

export interface SongScore {
  total: number;
  plus: number;
  minus: number;
  count: number;
  average: number;
}

export interface ParsedSunoInput {
  id: string;
  embedSrc: string;
}

export type SortMode = 'total' | 'average';
