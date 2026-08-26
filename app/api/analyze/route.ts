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

type Diagnosis = {
  category: string;
  title: string;
  confidence: number;
  explanation: string;
  signals: string[];
  recommendation: string;
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
