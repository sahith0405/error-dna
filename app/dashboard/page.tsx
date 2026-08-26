"use client";

import Link from "next/link";
import { useState } from "react";

type ErrorDNAEntry = {
  fingerprintId: string;
  name: string;
  count: number;
};
type SubmissionHistoryEntry = {
  id: string;
  problemId: string;
  problemTitle: string;
  status: string;
  fingerprintId: string;
  fingerprintName: string;
  timestamp: string;
  passedTests?: number;
  totalTests?: number;
};


export default function DashboardPage() {
  const [errorDNA] = useState<ErrorDNAEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = localStorage.getItem("error-dna-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [submissions] = useState<SubmissionHistoryEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = localStorage.getItem("error-dna-submissions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalErrors = errorDNA.reduce(
    (total, item) => total + item.count,
    0,
  );

  const sortedDNA = [...errorDNA].sort(
    (a, b) => b.count - a.count,
  );

  const mostCommon = sortedDNA[0];

  const recentSubmissions = submissions.slice(0, 5);
  const previousSubmissions = submissions.slice(5, 10);

  const recentErrors = recentSubmissions.filter(
    (submission) => submission.status !== "ACCEPTED",
  ).length;

  const previousErrors = previousSubmissions.filter(
    (submission) => submission.status !== "ACCEPTED",
  ).length;

  const hasEnoughTrendData =
    recentSubmissions.length >= 3 &&
    previousSubmissions.length >= 3;

  const trend =
    hasEnoughTrendData && recentErrors < previousErrors
      ? "improving"
      : hasEnoughTrendData && recentErrors > previousErrors
        ? "needs attention"
        : "stable";

  const getPercentage = (count: number) => {
    if (totalErrors === 0) {
      return 0;
    }

    return Math.round((count / totalErrors) * 100);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-[-0.02em]"
          >
            ERROR DNA
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Problems
            </Link>

            <Link
              href="/dashboard"
              className="font-medium text-[var(--text-primary)]"
            >
              Your Progress
            </Link>
          </nav>
        </div>
      </header>

      <section className="container pb-20 pt-12 sm:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Personal learning profile
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
            Your Error DNA
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            A summary of the programming mistakes appearing most
            often in your submissions.
          </p>
        </div>

        {errorDNA.length === 0 ? (
          <div className="mt-12 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">
              Your Error DNA is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
              Solve a problem and submit your code to start
              building your personal error profile.
            </p>

            <Link
              href="/"
              className="btn btn-primary mt-6 inline-flex"
            >
              Start practicing
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Recorded errors
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {totalErrors}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Error patterns
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {errorDNA.length}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Most common
                </p>

                <p className="mt-3 text-lg font-semibold">
                  {mostCommon.name}
                </p>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {getPercentage(mostCommon.count)}% of recorded errors
                </p>
              </div>
            </div>

            <section className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                  Error profile
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Recurring mistakes
                </h2>
              </div>

              <div className="mt-6 space-y-5">
                {sortedDNA.map((entry) => {
                  const percentage = getPercentage(entry.count);

                  return (
                    <div key={entry.fingerprintId}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">
                          {entry.name}
                        </span>

                        <span className="text-xs text-[var(--text-muted)]">
                          {entry.count}{" "}
                          {entry.count === 1 ? "occurrence" : "occurrences"}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {percentage}% of recorded errors
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {submissions.length > 0 && (
              <section className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                    Learning trend
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Error pattern trend
                  </h2>
                </div>

                {!hasEnoughTrendData ? (
                  <div className="mt-5 rounded-md bg-[var(--surface-subtle)] p-4">
                    <p className="text-sm font-semibold">
                      Not enough data yet
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      Complete at least six analyzed submissions to
                      compare your recent error rate with your earlier
                      attempts.
                    </p>

                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      {submissions.length} submission
                      {submissions.length === 1 ? "" : "s"} recorded
                    </p>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold capitalize">
                          {trend}
                        </p>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Recent error rate: {recentErrors} /{" "}
                          {recentSubmissions.length}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[var(--text-muted)]">
                          Earlier
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {previousErrors} /{" "}
                          {previousSubmissions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {submissions.length > 0 && (
              <section className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                    Submission history
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Recent submissions
                  </h2>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Your latest analyzed attempts and the error
                    patterns detected in them.
                  </p>
                </div>

                <div className="mt-6 divide-y divide-[var(--border)]">
                  {submissions.slice(0, 10).map((submission) => {
                    const date = new Date(submission.timestamp);

                    const statusLabel = submission.status.replaceAll(
                      "_",
                      " ",
                    );

                    return (
                      <div
                        key={submission.id}
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {submission.problemTitle}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-[var(--warning-bg)] px-2 py-1 text-xs font-semibold text-[var(--warning)]">
                              {submission.fingerprintName}
                            </span>

                            <span className="text-xs text-[var(--text-muted)]">
                              {statusLabel}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          {submission.totalTests !== undefined && (
                            <p className="text-xs text-[var(--text-secondary)]">
                              {submission.passedTests ?? 0} /{" "}
                              {submission.totalTests} tests passed
                            </p>
                          )}

                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {date.toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Focus area
                </p>

                <h2 className="mt-3 text-lg font-semibold">
                  {mostCommon.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  This is currently your most frequent detected
                  error pattern. Focus on understanding why this
                  mistake appears before moving to more advanced
                  optimization.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Next step
                </p>

                <h2 className="mt-3 text-lg font-semibold">
                  Practice deliberately
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Use the diagnosis after every failed submission
                  to identify the pattern behind the mistake, not
                  just the test case that failed.
                </p>

                <Link
                  href="/"
                  className="btn btn-secondary mt-5 inline-flex"
                >
                  Practice another problem
                </Link>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
