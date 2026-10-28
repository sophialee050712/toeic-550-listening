// Single progress store. Local copy always lives in localStorage; when a
// Supabase session exists, every save also pushes to the cloud (see sync.ts)
// so iPhone and computer converge on the newest copy.
import { pushProgress } from "./sync";
export type MockResult = {
  id: string;
  date: string; // YYYY-MM-DD
  p1: number; // /6
  p2: number; // /25
  p3: number; // /39
  p4: number; // /30
  speed: number; // 0.75 | 0.9 | 1
  paused: boolean;
};

export type PartKey = "p1" | "p2" | "p3" | "p4";

export type Progress = {
  version: 1;
  updatedAt: string; // ISO timestamp of the last save; sync compares this
  sessionDates: string[]; // YYYY-MM-DD, one entry per active day
  answers: Record<PartKey, { correct: number; total: number }>;
  mocks: MockResult[];
  reading: { score: number; date: string } | null;
  vocab: Record<string, { reviews: number; mastered: boolean }>;
  dictation: { correctWords: number; totalWords: number; checked: number };
  carIndex: number;
  carCompleted: number;
};

export const STORAGE_KEY = "toeic550-v1";

export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function emptyProgress(): Progress {
  return {
    version: 1,
    updatedAt: "",
    sessionDates: [],
    answers: {
      p1: { correct: 0, total: 0 },
      p2: { correct: 0, total: 0 },
      p3: { correct: 0, total: 0 },
      p4: { correct: 0, total: 0 },
    },
    mocks: [],
    reading: null,
    vocab: {},
    dictation: { correctWords: 0, totalWords: 0, checked: 0 },
    carIndex: 0,
    carCompleted: 0,
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const base = emptyProgress();
    return {
      ...base,
      ...parsed,
      updatedAt: parsed.updatedAt || "",
      answers: { ...base.answers, ...(parsed.answers || {}) },
      dictation: { ...base.dictation, ...(parsed.dictation || {}) },
      vocab: parsed.vocab || {},
      mocks: parsed.mocks || [],
      sessionDates: parsed.sessionDates || [],
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress, opts?: { push?: boolean }) {
  if (typeof window === "undefined") return;
  // When push is disabled (adopting a cloud copy on sync), keep the cloud
  // timestamp so the next sync does not treat this copy as newer.
  const toSave: Progress =
    opts?.push === false ? p : { ...p, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage full / private mode: progress simply is not persisted.
  }
  // Fire-and-forget cloud push: a failed push never blocks studying, and
  // the next app open re-syncs from the newest copy on either side.
  if (opts?.push !== false) void pushProgress(toSave);
}

export function withSession(p: Progress, date = todayStr()): Progress {
  if (p.sessionDates.includes(date)) return p;
  return { ...p, sessionDates: [...p.sessionDates, date] };
}

export function recordAnswer(p: Progress, part: PartKey, correct: boolean): Progress {
  const next = withSession(p);
  const cur = next.answers[part];
  return {
    ...next,
    answers: {
      ...next.answers,
      [part]: { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 },
    },
  };
}

export function resetProgress(): Progress {
  const p = emptyProgress();
  saveProgress(p);
  return p;
}
