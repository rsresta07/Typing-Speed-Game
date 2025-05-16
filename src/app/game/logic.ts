// Timer, Levenshtein logic

import { levenshtein } from "@/lib/levenshtein";

export function calculateAccuracy(input: string, prompt: string): number {
  const dist = levenshtein(input.trim(), prompt.trim());
  const maxLen = Math.max(input.trim().length, prompt.trim().length);
  return Math.max(0, 100 - Math.floor((dist / maxLen) * 100));
}

export function calculateWPM(
  wordCount: number,
  secondsElapsed: number
): number {
  const minutes = secondsElapsed / 60;
  if (minutes === 0) return 0;
  return Math.round(wordCount / minutes);
}
