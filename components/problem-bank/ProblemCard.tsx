import Link from "next/link";
import type { Problem } from "@/data/problems";

type ProblemCardProps = {
  problem: Problem;
};

function getDifficultyClasses(difficulty: Problem["difficulty"]) {
  switch (difficulty) {
    case "Easy":
      return "bg-[var(--success-bg)] text-[var(--success)]";

    case "Medium":
      return "bg-[var(--warning-bg)] text-[var(--warning)]";

    case "Hard":
      return "bg-[var(--danger-bg)] text-[var(--danger)]";
  }
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <article className="group border border-[var(--border)] bg-[var(--surface)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              {problem.title}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              {problem.description}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getDifficultyClasses(
              problem.difficulty,
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {problem.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-xs text-[var(--text-muted)]">
            Acceptance {problem.acceptance}
          </span>

          <Link
            href={`/problems/${problem.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)] transition-all group-hover:gap-2.5"
          >
            Solve
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}