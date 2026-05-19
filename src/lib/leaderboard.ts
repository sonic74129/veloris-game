/** Leaderboard persistence — Azure Function when VITE_LEADERBOARD_API is set, localStorage fallback */

export interface LeaderboardEntry {
  rank?: number;
  playerName: string;
  company: string;
  totalScore: number;
  totalTime: number;
  totalWrongAttempts: number;
  totalHintsUsed: number;
  timestamp: number;
  isYou?: boolean;
}

const API_URL = import.meta.env.VITE_LEADERBOARD_API as string | undefined;
const API_GET_URL = import.meta.env.VITE_LEADERBOARD_GET as string | undefined;
const API_POST_URL = import.meta.env.VITE_LEADERBOARD_POST as string | undefined;
const STORAGE_KEY = 'frontier:leaderboard';

const SEED_ENTRIES: LeaderboardEntry[] = [
  { playerName: 'Miranda Priestly', company: 'Runway Group', totalScore: 5200, totalTime: 95, totalWrongAttempts: 1, totalHintsUsed: 0, timestamp: 1716000000000 },
  { playerName: 'Lily Chen', company: 'Contoso Maison', totalScore: 4800, totalTime: 110, totalWrongAttempts: 2, totalHintsUsed: 0, timestamp: 1716100000000 },
  { playerName: 'Kinky Wang', company: 'Fabrikam', totalScore: 4500, totalTime: 120, totalWrongAttempts: 3, totalHintsUsed: 1, timestamp: 1716200000000 },
  { playerName: 'Nigel', company: 'Atelier AI', totalScore: 3900, totalTime: 140, totalWrongAttempts: 4, totalHintsUsed: 2, timestamp: 1716300000000 },
  { playerName: 'Emily Charlton', company: 'Cerulean', totalScore: 3200, totalTime: 160, totalWrongAttempts: 5, totalHintsUsed: 3, timestamp: 1716400000000 },
];

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
    if (a.totalWrongAttempts !== b.totalWrongAttempts) return a.totalWrongAttempts - b.totalWrongAttempts;
    return a.totalHintsUsed - b.totalHintsUsed;
  });
}

function assignRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

// ─── Power Automate / Google Apps Script / Azure Function mode ───

async function fetchFromApi(): Promise<LeaderboardEntry[] | null> {
  const url = API_GET_URL || API_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    return (await res.json()) as LeaderboardEntry[];
  } catch {
    return null;
  }
}

async function postToApi(entry: Omit<LeaderboardEntry, 'rank' | 'isYou' | 'timestamp'>): Promise<boolean> {
  const url = API_POST_URL || API_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      redirect: 'follow',
    });
    return res.ok || res.type === 'opaque';
  } catch {
    return false;
  }
}

// ─── Public API ─────────────────────────────────────────────────

/** Load leaderboard (Azure API first, localStorage fallback) */
export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  // Try API
  const remote = await fetchFromApi();
  if (remote && remote.length > 0) {
    return assignRanks(remote);
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = assignRanks(sortEntries(SEED_ENTRIES));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return assignRanks(sortEntries(SEED_ENTRIES));
  }
}

/** Save a new entry and return updated board */
export async function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'rank' | 'isYou' | 'timestamp'>,
): Promise<LeaderboardEntry[]> {
  // Try posting to API
  const posted = await postToApi(entry);

  if (posted) {
    // Reload from API to get fresh ranked list
    const remote = await fetchFromApi();
    if (remote) {
      // Mark the player's latest entry as "you"
      const ranked = assignRanks(remote);
      const youIdx = ranked.findIndex(
        (e) => e.playerName === entry.playerName && e.company === entry.company,
      );
      if (youIdx >= 0) ranked[youIdx] = { ...ranked[youIdx], isYou: true };
      // Also cache locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ranked));
      return ranked;
    }
  }

  // Fallback: localStorage only
  const current = await loadLeaderboard();
  const cleaned = current.map((e) => ({ ...e, isYou: false }));
  const newEntry: LeaderboardEntry = {
    ...entry,
    timestamp: Date.now(),
    isYou: true,
  };
  const merged = sortEntries([...cleaned, newEntry]);
  const ranked = assignRanks(merged);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranked));
  return ranked;
}

/** Reset leaderboard to seed data */
export async function resetLeaderboard(): Promise<LeaderboardEntry[]> {
  localStorage.removeItem(STORAGE_KEY);
  return loadLeaderboard();
}
