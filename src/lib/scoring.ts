/** Stage scoring formula + run aggregation */

export interface StageResult {
  stageId: string;
  timeSeconds: number;
  wrongAttempts: number;
  hintsUsed: number;
}

export interface StageScore extends StageResult {
  isPerfect: boolean;
  score: number;
}

export interface RunResult {
  stages: StageScore[];
  totalScore: number;
  totalTime: number;
  totalWrongAttempts: number;
  totalHintsUsed: number;
}

/**
 * 1000 - 5*t - 100*wrong - 150*hint + (perfect ? 300 : 0)
 * Clamped to [0, ∞)
 */
export function computeStageScore(result: StageResult): StageScore {
  const isPerfect = result.wrongAttempts === 0 && result.hintsUsed === 0;
  const raw =
    1000 -
    5 * result.timeSeconds -
    100 * result.wrongAttempts -
    150 * result.hintsUsed +
    (isPerfect ? 300 : 0);
  return {
    ...result,
    isPerfect,
    score: Math.max(0, Math.round(raw)),
  };
}

/** Aggregate all 5 stage scores into a full run result */
export function computeRunResult(stages: StageScore[]): RunResult {
  return {
    stages,
    totalScore: stages.reduce((s, r) => s + r.score, 0),
    totalTime: stages.reduce((s, r) => s + r.timeSeconds, 0),
    totalWrongAttempts: stages.reduce((s, r) => s + r.wrongAttempts, 0),
    totalHintsUsed: stages.reduce((s, r) => s + r.hintsUsed, 0),
  };
}

/** Miranda verdict thresholds */
export type Verdict = 'HIGH' | 'MID' | 'LOW';

export function getVerdict(totalScore: number): Verdict {
  if (totalScore >= 4500) return 'HIGH';
  if (totalScore >= 2500) return 'MID';
  return 'LOW';
}
