import { NextResponse } from "next/server";

const PISTON_EXECUTE_URL =
  "https://emkc.org/api/v2/piston/execute";
const PISTON_CPP_VERSION = "10.2.0";
const WANDBOX_COMPILE_URL =
  "https://wandbox.org/api/compile.json";
const EXECUTION_TIMEOUT_MS = 10_000;

type ExecuteRequest = {
  code: string;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
  }[];
};

function normalizeOutput(output: string) {
  return output.trim().replace(/\s+/g, " ");
}

type PistonStage = {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number | null;
  signal?: string | null;
};

type PistonResponse = {
  compile?: PistonStage;
  run?: PistonStage;
};

async function fetchWithTimeout(
  url: string,
  body: Record<string, unknown>,
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    EXECUTION_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof payload === "object" && payload !== null
          ? JSON.stringify(payload)
          : `Hosted compiler returned HTTP ${response.status}.`,
      );
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function executeWithPiston(
  code: string,
  input: string,
) : Promise<PistonResponse> {
  return (await fetchWithTimeout(PISTON_EXECUTE_URL, {
    language: "cpp",
    version: PISTON_CPP_VERSION,
    files: [
      {
        name: "main.cpp",
        content: code,
      },
    ],
    stdin: input,
  })) as PistonResponse;
}

async function executeWithWandbox(
  code: string,
  input: string,
): Promise<PistonResponse> {
  const result = (await fetchWithTimeout(WANDBOX_COMPILE_URL, {
    compiler: "gcc-head",
    options: "-std=c++17",
    code,
    stdin: input,
  })) as {
    status?: string;
    signal?: string;
    compiler_error?: string;
    compiler_output?: string;
    program_output?: string;
    program_error?: string;
    program_message?: string;
  };

  const compileFailed = Boolean(result.compiler_error);
  const exitCode = Number.parseInt(result.status ?? "0", 10);

  return {
    compile: {
      code: compileFailed ? 1 : 0,
      stderr: result.compiler_error,
      output: result.compiler_output,
    },
    run: {
      code: Number.isNaN(exitCode) ? 1 : exitCode,
      signal: result.signal,
      stdout: result.program_output,
      stderr: result.program_error || result.program_message,
    },
  };
}

async function executeWithHostedCompiler(
  code: string,
  input: string,
): Promise<PistonResponse> {
  try {
    return await executeWithPiston(code, input);
  } catch (pistonError) {
    try {
      return await executeWithWandbox(code, input);
    } catch (wandboxError) {
      throw new Error(
        `Piston: ${pistonError instanceof Error ? pistonError.message : "request failed"}; Wandbox: ${wandboxError instanceof Error ? wandboxError.message : "request failed"}`,
      );
    }
  }
}

export async function POST(request: Request) {
  let body: ExecuteRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: "INVALID_REQUEST",
        message: "Invalid JSON request.",
      },
      { status: 400 },
    );
  }

  if (
    typeof body.code !== "string" ||
    !Array.isArray(body.testCases)
  ) {
    return NextResponse.json(
      {
        success: false,
        status: "INVALID_REQUEST",
        message: "Code and testCases are required.",
      },
      { status: 400 },
    );
  }

  if (body.code.length > 100_000) {
    return NextResponse.json(
      {
        success: false,
        status: "CODE_TOO_LARGE",
        message: "Code exceeds the allowed size.",
      },
      { status: 400 },
    );
  }

  if (body.testCases.length === 0) {
    return NextResponse.json(
      {
        success: false,
        status: "NO_TEST_CASES",
        message: "No test cases were provided.",
      },
      { status: 400 },
    );
  }

  try {
    const results = [];

    for (const testCase of body.testCases) {
      try {
        const pistonResult = await executeWithHostedCompiler(
          body.code,
          testCase.input,
        );

        const compilation = pistonResult.compile;
        if (compilation?.code !== undefined && compilation.code !== 0) {
          return NextResponse.json({
            success: false,
            status: "COMPILATION_ERROR",
            message: "Your code could not be compiled.",
            compileError:
              compilation.stderr ||
              compilation.output ||
              "Compilation failed.",
          });
        }

        const execution = pistonResult.run;
        if (!execution) {
          throw new Error("Piston did not return an execution result.");
        }

        if (execution.signal || (execution.code !== undefined && execution.code !== 0)) {
          return NextResponse.json({
            success: false,
            status: "RUNTIME_ERROR",
            message: "Your program terminated unexpectedly.",
            testCaseId: testCase.id,
            runtimeError:
              execution.stderr ||
              execution.output ||
              execution.signal ||
              "Program terminated with an error.",
          });
        }

        const actualOutput = normalizeOutput(
          execution.stdout ?? execution.output ?? "",
        );

        const expectedOutput = normalizeOutput(
          testCase.expectedOutput,
        );

        results.push({
          testCaseId: testCase.id,
          passed: actualOutput === expectedOutput,
          expectedOutput,
          actualOutput,
        });
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return NextResponse.json({
            success: false,
            status: "TIME_LIMIT_EXCEEDED",
            message: "Your program exceeded the execution time limit.",
            testCaseId: testCase.id,
          });
        }

        const runtimeError =
          error instanceof Error
            ? error.message
            : "Program execution failed.";

        return NextResponse.json({
          success: false,
          status: "RUNTIME_ERROR",
          message: "Your program terminated unexpectedly.",
          testCaseId: testCase.id,
          runtimeError,
        });
      }
    }

    const passedCount = results.filter(
      (result) => result.passed,
    ).length;

    const allPassed =
      results.length > 0 &&
      passedCount === results.length;

    return NextResponse.json({
      success: true,
      status: allPassed
        ? "ACCEPTED"
        : "WRONG_ANSWER",
      totalTests: results.length,
      passedTests: passedCount,
      failedTests: results.length - passedCount,
      results,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      status: "RUNTIME_ERROR",
      message: "The execution service could not be reached.",
      runtimeError:
        error instanceof Error
          ? error.message
          : "Program execution failed.",
    });
  }
}
