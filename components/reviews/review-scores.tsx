/**
 * review-scores.tsx
 * The overall score ring from the review hero and the per-criterion bars
 * from the "Editorial ratings" card.
 */

import type { ReviewScore } from "@/lib/types/records";

const RING_SIZE = 72;
const RING_STROKE = 6;

export function ScoreRing({ rating }: { rating: number }) {
  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(Math.max(rating / 10, 0), 1) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="-rotate-90" aria-hidden>
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} fill="none" strokeWidth={RING_STROKE} className="stroke-dune-850" />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          fill="none"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          className="stroke-sun"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[22px] font-black text-white">{rating}</span>
    </div>
  );
}

export function ScoreBar({ score }: { score: ReviewScore }) {
  const pct = Math.min(Math.max(score.score * 10, 0), 100);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="w-32 shrink-0 text-xs text-dune-300">{score.label}</span>
        <div
          role="meter"
          aria-label={score.label}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={score.score}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-dune-850"
        >
          <div className="h-full rounded-full bg-sun" style={{ width: `${pct}%` }} />
        </div>
        <span className="w-6 text-right text-xs font-semibold tabular-nums text-white">{score.score}</span>
      </div>
      {score.note && <p className="mt-1 text-[11px] leading-snug text-dune-500 sm:ml-[8.75rem]">{score.note}</p>}
    </div>
  );
}
