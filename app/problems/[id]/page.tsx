"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { problems } from "@/data/problems";
import CodeEditor from "@/components/coding-workspace/CodeEditor";

type JudgeResult = {
  success: boolean;
  status: string;
  message?: string;
  totalTests?: number;
  passedTests?: number;
  failedTests?: number;
  compileError?: string;
  runtimeError?: string;
  testCaseId?: string;
  results?: {
    testCaseId: string;
    passed: boolean;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  }[];
};

export default function ProblemPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const problem = problems.find((item) => item.id === id);

  const [code, setCode] = useState(
    problem?.starterCode ?? "",
  );

  const [status, setStatus] = useState<
    "idle" | "running" | "submitted"
  >("idle");

  const [judgeResult, setJudgeResult] =
    useState<JudgeResult | null>(null);

  if (!problem) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="container flex h-14 items-center">
            <Link
              href="/"
              className="text-[15px] font-semibold"
            >
              ERROR DNA
            </Link>
          </div>
        </header>

        <section className="container py-20">
          <h1 className="text-2xl font-semibold">
            Problem not found
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            This problem is not available in the practice library.
          </p>

          <Link
            href="/"
            className="btn btn-primary mt-6 inline-flex"
          >
            Back to problems
          </Link>
        </section>
      </main>
    );
  }

  async function executeCode() {
    if (!problem) {
      return;
    }

    setStatus("running");
    setJudgeResult(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          testCases: problem.testCases,
        }),
      });

      const result: JudgeResult = await response.json();

      setJudgeResult(result);

      if (result.status === "ACCEPTED") {
        setStatus("submitted");
      } else {
        setStatus("idle");
      }
    } catch {
      setJudgeResult({
        success: false,
        status: "NETWORK_ERROR",
        message:
          "Unable to connect to the execution server.",
      });

      setStatus("idle");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-[15px] font-semibold"
          >
            ERROR DNA
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Problems
            </Link>

            <span className="text-[var(--text-muted)]">
              Practice workspace
            </span>
          </nav>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-56px)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(420px,1.5fr)_minmax(280px,0.8fr)]">
        <section className="overflow-y-auto border-b border-[var(--border)] bg-[var(--surface)] p-6 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                problem.difficulty === "Easy"
                  ? "bg-[var(--success-bg)] text-[var(--success)]"
                  : problem.difficulty === "Medium"
                    ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                    : "bg-[var(--danger-bg)] text-[var(--danger)]"
              }`}
            >
              {problem.difficulty}
            </span>

            <span className="text-xs text-[var(--text-muted)]">
              {problem.acceptance} acceptance
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            {problem.title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            {problem.description}
          </p>

          <div className="mt-7">
            <h2 className="text-sm font-semibold">
              Topics
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {problem.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md bg-[var(--surface-subtle)] px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-7">
            <h2 className="text-sm font-semibold">
              Examples
            </h2>

            <div className="mt-3 space-y-3">
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-md bg-[#f1f3f5] p-4 font-mono text-xs leading-6 text-[var(--text-secondary)]"
                >
                  <div>Input: {example.input}</div>
                  <div>Output: {example.output}</div>

                  {example.explanation && (
                    <div className="mt-1 font-sans text-[var(--text-secondary)]">
                      {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 border-t border-[var(--border)] pt-7">
            <h2 className="text-sm font-semibold">
              Expected Complexity
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {problem.expectedComplexity}
            </p>
          </div>

          <div className="mt-7 border-t border-[var(--border)] pt-7">
            <h2 className="text-sm font-semibold">
              What happens after Submit?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              ERROR DNA analyzes your submission and identifies
              recurring patterns in your mistakes.
            </p>
          </div>
        </section>

        <section className="flex min-h-[600px] flex-col bg-[#1e1e1e]">
          <div className="min-h-0 flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/10 bg-[#181818] px-4 py-3">
            <span className="font-mono text-xs text-white/40">
              C++17
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={executeCode}
                disabled={status === "running"}
                className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "running"
                  ? "Running..."
                  : "Run"}
              </button>

              <button
                type="button"
                onClick={executeCode}
                disabled={status === "running"}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#111318] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </section>

        <aside className="flex flex-col border-t border-[var(--border)] bg-[var(--surface)] lg:border-l lg:border-t-0">
          <div className="border-b border-[var(--border)] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
              Error DNA
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Diagnosis
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {judgeResult
                ? "Your latest submission has been analyzed."
                : "Run or submit your code to see the judge result."}
            </p>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
            {!judgeResult ? (
              <div className="max-w-xs text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)]">
                  <span className="text-[10px] font-bold tracking-wide text-[var(--text-muted)]">
                    DNA
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  Waiting for your submission
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Run or submit your code to execute the real C++17
                  judge.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <div
                  className={`rounded-lg border p-5 ${
                    judgeResult.status === "ACCEPTED"
                      ? "border-[var(--success)]/20 bg-[var(--success-bg)]"
                      : judgeResult.status === "WRONG_ANSWER"
                        ? "border-[var(--warning)]/20 bg-[var(--warning-bg)]"
                        : "border-[var(--danger)]/20 bg-[var(--danger-bg)]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                    Judge result
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {judgeResult.status.replaceAll("_", " ")}
                  </h3>

                  {judgeResult.message && (
                    <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {judgeResult.message}
                    </p>
                  )}

                  {judgeResult.totalTests !== undefined && (
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">
                      {judgeResult.passedTests ?? 0} /{" "}
                      {judgeResult.totalTests} test cases passed.
                    </p>
                  )}
                </div>

                {judgeResult.compileError && (
                  <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--danger)]">
                      Compiler output
                    </p>

                    <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-[var(--text-secondary)]">
                      {judgeResult.compileError}
                    </pre>
                  </div>
                )}

                {judgeResult.runtimeError && (
                  <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--danger)]">
                      Runtime error
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {judgeResult.runtimeError}
                    </p>
                  </div>
                )}

                {judgeResult.results && (
                  <div className="mt-4 space-y-2">
                    {judgeResult.results.map((result) => (
                      <div
                        key={result.testCaseId}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">
                            {result.testCaseId}
                          </span>

                          <span
                            className={
                              result.passed
                                ? "text-xs font-semibold text-[var(--success)]"
                                : "text-xs font-semibold text-[var(--danger)]"
                            }
                          >
                            {result.passed
                              ? "Passed"
                              : "Failed"}
                          </span>
                        </div>

                        {!result.passed && (
                          <div className="mt-3 space-y-2 font-mono text-xs">
                            <div>
                              <span className="text-[var(--text-muted)]">
                                Expected:
                              </span>{" "}
                              {result.expectedOutput}
                            </div>

                            <div>
                              <span className="text-[var(--text-muted)]">
                                Actual:
                              </span>{" "}
                              {result.actualOutput}
                            </div>

                            {result.error && (
                              <div className="text-[var(--danger)]">
                                {result.error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
