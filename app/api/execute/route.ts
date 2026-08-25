import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdtemp, writeFile, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

const execFileAsync = promisify(execFile);

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

function runExecutable(
  executablePath: string,
  input: string,
) {
  return new Promise<{
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    const child = execFile(
      executablePath,
      [],
      {
        timeout: 3000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          Object.assign(error, {
            stdout: stdout ?? "",
            stderr: stderr ?? "",
          });

          reject(error);
          return;
        }

        resolve({
          stdout: stdout ?? "",
          stderr: stderr ?? "",
        });
      },
    );

    if (child.stdin) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
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

  const workDirectory = await mkdtemp(
    path.join(tmpdir(), "error-dna-"),
  );

  const sourcePath = path.join(
    workDirectory,
    "solution.cpp",
  );

  const executablePath = path.join(
    workDirectory,
    "solution",
  );

  try {
    await writeFile(sourcePath, body.code, "utf8");

    try {
      await execFileAsync(
        "/usr/bin/g++",
        [
          "-std=c++17",
          "-O2",
          "-Wall",
          "-Wextra",
          sourcePath,
          "-o",
          executablePath,
        ],
        {
          timeout: 10_000,
          maxBuffer: 1024 * 1024,
        },
      );
    } catch (error: unknown) {
      const compileError =
        typeof error === "object" &&
        error !== null &&
        "stderr" in error &&
        typeof error.stderr === "string"
          ? error.stderr
          : "Compilation failed.";

      return NextResponse.json({
        success: false,
        status: "COMPILATION_ERROR",
        message: "Your code could not be compiled.",
        compileError,
      });
    }

    const results = [];

    for (const testCase of body.testCases) {
      try {
        const execution = await runExecutable(
          executablePath,
          testCase.input,
        );

        const actualOutput = normalizeOutput(
          execution.stdout,
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
        const executionError =
          typeof error === "object" &&
          error !== null &&
          "stderr" in error &&
          typeof error.stderr === "string"
            ? error.stderr
            : "Program execution failed.";

        const errorCode =
          typeof error === "object" &&
          error !== null &&
          "code" in error
            ? error.code
            : undefined;

        const errorKilled =
          typeof error === "object" &&
          error !== null &&
          "killed" in error &&
          error.killed === true;

        if (errorKilled || errorCode === "ETIMEDOUT") {
          return NextResponse.json({
            success: false,
            status: "TIME_LIMIT_EXCEEDED",
            message: "Your program exceeded the execution time limit.",
            testCaseId: testCase.id,
          });
        }

        return NextResponse.json({
          success: false,
          status: "RUNTIME_ERROR",
          message: "Your program terminated unexpectedly.",
          testCaseId: testCase.id,
          runtimeError:
            executionError || "Program terminated with an error.",
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
  } finally {
    await rm(workDirectory, {
      recursive: true,
      force: true,
    });
  }
}
