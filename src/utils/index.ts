import { Song, SongScore, ParsedSunoInput } from '../types';

export const LS_KEY = "suno-comparator-v3";

export function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function clampScore(n: number): -2 | -1 | 0 | 1 | 2 {
  if (n <= -2) return -2;
  if (n === -1) return -1;
  if (n === 0) return 0;
  if (n === 1) return 1;
  return 2;
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
  const notes = song.notes || [];
  const total = notes.reduce((sum, n) => sum + (n.score || 0), 0);
  const plus = notes.filter(n => n.score > 0).length;
  const minus = notes.filter(n => n.score < 0).length;
  const count = notes.length;
  const average = count > 0 ? total / count : 0;
  
  return { total, plus, minus, count, average };
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

  // score tests
  const s1: Song = { id: 'test1', embedSrc: '', originalInput: '', notes: [{ id: '1', text: '', score: 2, createdAt: 0 }, { id: '2', text: '', score: 1, createdAt: 0 }, { id: '3', text: '', score: -1, createdAt: 0 }] };
  const s2: Song = { id: 'test2', embedSrc: '', originalInput: '', notes: [] };
  
  const r1 = calcSongScore(s1); // total 2, avg 0.666...
  const r2 = calcSongScore(s2); // total 0, avg 0
  
  console.assert(r1.total === 2 && Math.abs(r1.average - (2/3)) < 1e-9, 'calcSongScore totals/avg failed');
  console.assert(r2.total === 0 && r2.average === 0, 'calcSongScore empty failed');
}
