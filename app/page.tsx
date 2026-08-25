"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { problems } from "@/data/problems";
import ProblemCard from "@/components/problem-bank/ProblemCard";

const filters = ["All", "Easy", "Medium", "Hard"] as const;

type Filter = (typeof filters)[number];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesDifficulty =
        activeFilter === "All" || problem.difficulty === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        problem.title.toLowerCase().includes(query) ||
        problem.description.toLowerCase().includes(query) ||
        problem.topics.some((topic) =>
          topic.toLowerCase().includes(query),
        );

      return matchesDifficulty && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <main className="min-h-screen">
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
              className="font-medium text-[var(--text-primary)]"
            >
              Problems
            </Link>

            <Link
              href="#progress"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Your Progress
            </Link>
          </nav>
        </div>
      </header>

      <section className="container pb-20 pt-16 sm:pt-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            AI-powered coding practice
          </p>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-5xl sm:leading-[1.08]">
            Wrong Answer isn&apos;t the problem.
            <br />
            <span className="text-[var(--text-secondary)]">
              Your pattern is.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
            Practice coding. Discover your recurring mistakes.
          </p>
        </div>

        <div className="mt-12 border-y border-[var(--border)] py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <label htmlFor="problem-search" className="sr-only">
                Search problems
              </label>

              <input
                id="problem-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search problems..."
                className="input"
              />
            </div>

            <div
              className="flex flex-wrap items-center gap-1"
              aria-label="Difficulty filters"
            >
              {filters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={isActive}
                    className={
                      isActive
                        ? "rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
                    }
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <section className="mt-10" aria-labelledby="problems-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">
                Practice library
              </p>

              <h2
                id="problems-heading"
                className="mt-1 text-xl font-semibold tracking-[-0.025em]"
              >
                Problems
              </h2>
            </div>

            <span className="text-sm text-[var(--text-muted)]">
              {filteredProblems.length}{" "}
              {filteredProblems.length === 1 ? "problem" : "problems"}
            </span>
          </div>

          {filteredProblems.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="mt-5 border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                No problems found
              </p>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Try a different search term or difficulty.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                className="btn btn-secondary mt-5"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}