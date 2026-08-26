import { NextResponse } from "next/server";

type AnalyzeRequest = {
  code: string;
  status: string;
  compileError?: string;
  runtimeError?: string;
  results?: {
    testCaseId: string;
    passed: boolean;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  }[];
};

type ErrorFingerprint = {
  id: string;
  name: string;
  description: string;
};

type Diagnosis = {
  category: string;
  title: string;
  confidence: number;
  explanation: string;
  signals: string[];
  recommendation: string;
  fingerprint: ErrorFingerprint;
};

function analyzeSubmission(body: AnalyzeRequest): Diagnosis {
  const {
    code,
    status,
    compileError,
    runtimeError,
    results = [],
  } = body;

  if (status === "COMPILATION_ERROR") {
    const error = (compileError ?? "").toLowerCase();

    if (
      error.includes("expected") ||
      error.includes("syntax") ||
      error.includes("missing") ||
      error.includes("undeclared")
    ) {
      return {
        category: "Syntax / Compilation",
        title: "The code contains a compilation-level mistake.",
        confidence: 0.96,
        explanation:
          "The compiler rejected the program before it could execute. This usually indicates a syntax, declaration, type, or structural issue.",
        signals: ["Compiler rejected the source code"],
        recommendation:
          "Read the first compiler error carefully and fix that error before addressing later messages.",
        fingerprint: {
          id: "syntax-compilation",
          name: "Syntax / Compilation",
          description:
            "The source code cannot be compiled because of a syntax, declaration, type, or structural issue.",
        },
      };
    }

    return {
      category: "Compilation Error",
      title: "Your program could not be compiled.",
      confidence: 0.9,
      explanation:
        "The submission contains an issue that prevents the C++ compiler from producing an executable program.",
      signals: ["Compilation failed"],
      recommendation:
        "Start with the first compiler diagnostic and verify declarations, types, headers, and syntax.",
      fingerprint: {
        id: "compilation-error",
        name: "Compilation Error",
        description:
          "The compiler cannot produce an executable program from the submitted source.",
      },
    };
  }

  if (status === "RUNTIME_ERROR") {
    const runtime = (runtimeError ?? "").toLowerCase();

    const signals = ["Program terminated during execution"];

    if (
      runtime.includes("segmentation") ||
      runtime.includes("segfault")
    ) {
      signals.push("Possible invalid memory access");

      return {
        category: "Memory / Runtime Safety",
        title: "Possible invalid memory access.",
        confidence: 0.93,
        explanation:
          "The program terminated while running and the runtime output suggests an invalid memory access.",
        signals,
        recommendation:
          "Check array bounds, pointers, references, and container access before using them.",
        fingerprint: {
          id: "invalid-memory-access",
          name: "Invalid Memory Access",
          description:
            "The program may access memory outside a valid array, container, pointer, or reference boundary.",
        },
      };
    }

    return {
      category: "Runtime Error",
      title: "The program crashes during execution.",
      confidence: 0.9,
      explanation:
        "The code compiled successfully but terminated unexpectedly while executing.",
      signals,
      recommendation:
        "Check division by zero, invalid indexing, null pointers, recursion depth, and other runtime assumptions.",
      fingerprint: {
        id: "runtime-crash",
        name: "Runtime Crash",
        description:
          "The program compiles but terminates unexpectedly while executing.",
      },
    };
  }

  if (status === "TIME_LIMIT_EXCEEDED") {
    return {
      category: "Complexity",
      title: "The solution may be too slow.",
      confidence: 0.88,
      explanation:
        "The program exceeded the execution time limit. This can indicate an inefficient algorithm or an unexpectedly large amount of work.",
      signals: ["Execution exceeded the time limit"],
      recommendation:
        "Look for unnecessary nested loops, repeated computation, or data structures that can be replaced with faster alternatives.",
      fingerprint: {
        id: "time-complexity",
        name: "Time Complexity",
        description:
          "The solution performs too much work to finish within the execution limit.",
      },
    };
  }

  if (status === "WRONG_ANSWER") {
    const failed = results.filter((result) => !result.passed);
    const passed = results.filter((result) => result.passed);

    const signals: string[] = [
      `${passed.length} test case(s) passed`,
      `${failed.length} test case(s) failed`,
    ];

    const actualOutputs = failed.map(
      (result) => result.actualOutput,
    );

    const expectedOutputs = failed.map(
      (result) => result.expectedOutput,
    );

    if (failed.length > 0) {
      signals.push(
        `Expected: ${expectedOutputs.slice(0, 2).join(" | ")}`,
      );
      signals.push(
        `Actual: ${actualOutputs.slice(0, 2).join(" | ")}`,
      );
    }

    if (
      /return\s*\{\s*\};/.test(code) ||
      /return\s*false\s*;/.test(code)
    ) {
      return {
        category: "Incomplete Logic",
        title: "The solution appears incomplete.",
        confidence: 0.94,
        explanation:
          "The submission reaches the judge but appears to return a placeholder result instead of implementing the required logic.",
        signals: [
          ...signals,
          "Placeholder return detected",
        ],
        recommendation:
          "Implement the core algorithm before optimizing or handling advanced edge cases.",
        fingerprint: {
          id: "incomplete-logic",
          name: "Incomplete Logic",
          description:
            "The submission appears to contain placeholder logic instead of a complete solution.",
        },
      };
    }

    if (
      code.includes("int ") &&
      code.includes("/") &&
      code.includes("0")
    ) {
      signals.push("Possible division-related edge case");

      return {
        category: "Edge Case Handling",
        title: "The solution may not handle an edge case.",
        confidence: 0.72,
        explanation:
          "Some tests pass, but at least one test produces an unexpected result. The code contains a potentially unsafe arithmetic assumption.",
        signals,
        recommendation:
          "Identify the smallest failing input and trace the values through the relevant calculation.",
        fingerprint: {
          id: "edge-case-handling",
          name: "Edge Case Handling",
          description:
            "The general approach may work, but an input boundary or unusual case is not handled correctly.",
        },
      };
    }

    return {
      category: "Logic Error",
      title: "The core logic produces an unexpected result.",
      confidence: 0.82,
      explanation:
        "The program compiled and executed, but its output differs from the expected result for one or more test cases.",
      signals,
      recommendation:
        "Compare the first failing test case with your algorithm step by step. Focus on the exact point where your expected state differs from the actual state.",
      fingerprint: {
        id: "logic-error",
        name: "Logic Error",
        description:
          "The implementation produces an incorrect result because its algorithmic reasoning differs from the required behavior.",
      },
    };
  }

  if (status === "ACCEPTED") {
    return {
      category: "No Detected Error",
      title: "No error detected.",
      confidence: 1,
      explanation:
        "The submission passed all available test cases.",
      signals: ["All test cases passed"],
      recommendation:
        "Continue practicing and watch for recurring patterns across future submissions.",
      fingerprint: {
        id: "no-error",
        name: "No Detected Error",
        description:
          "The submission passed all available test cases.",
      },
    };
  }

  return {
    category: "Unknown",
    title: "The submission could not be classified.",
    confidence: 0.5,
    explanation:
      "The current Error DNA analyzer does not have enough information to classify this result.",
    signals: [`Judge status: ${status}`],
    recommendation:
      "Run the submission again and inspect the judge result.",
    fingerprint: {
      id: "unknown",
      name: "Unknown",
      description:
        "There is not enough information to identify a specific error pattern.",
    },
  };
}

export async function POST(request: Request) {
  let body: AnalyzeRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request.",
      },
      { status: 400 },
    );
  }

  if (
    typeof body.code !== "string" ||
    typeof body.status !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Code and status are required.",
      },
      { status: 400 },
    );
  }

  const diagnosis = analyzeSubmission(body);

  return NextResponse.json({
    success: true,
    diagnosis,
  });
}
