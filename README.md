# ERROR DNA

> Don't just fix the code. Understand the mistake.

ERROR DNA is a coding practice platform for students who need more than a binary judge result. A normal `Wrong Answer` tells a student that the output is incorrect, but not what reasoning pattern may have caused the mistake. ERROR DNA runs C++ submissions against multiple test cases, examines the execution evidence, and turns the result into an understandable diagnosis that students can use to improve.

## Why It Matters

Repeatedly guessing at changes until a solution is accepted can hide the underlying misconception. ERROR DNA connects each submission to an error category and fingerprint, then provides an explanation, supporting signals, confidence, and a concrete recommendation. Over time, the dashboard makes recurring patterns visible.

## Features

- C++ coding problems with difficulty filtering and search
- Monaco-based C++17 editor
- Multi-test-case compilation and execution
- Accepted, Wrong Answer, Compilation Error, Runtime Error, and Time Limit Exceeded results
- Test-case expected and actual output comparison
- Error categories and fingerprints such as Logic Error, Incomplete Logic, Edge Case Handling, Complexity, and Runtime Crash
- Diagnosis explanations, confidence scores, signals, and recommendations
- Local submission history
- Error profile with recurring patterns and most-common errors
- Learning trend comparing recent and earlier submission error rates

## AI Analysis Layer

The current repository does not contain a trained machine-learning model or an external AI provider integration. Its analysis layer is a deterministic TypeScript analyzer in `/api/analyze` that applies diagnosis rules to the available submission evidence.

The UI sends the analyzer:

- Submitted C++ source code
- Judge status from `/api/execute`
- Compiler or runtime error text when available
- Each test case's pass/fail state, expected output, and actual output

The analyzer returns a diagnosis containing:

- Error category and title
- Confidence score
- Explanation
- Evidence signals
- Recommendation
- Stable error fingerprint ID, name, and description

This design provides an explainable analysis foundation for the current demo. A trained model or external AI service is future work, not a claim about the current implementation.

## Architecture

```mermaid
flowchart TD
    Student --> UI[Next.js UI<br/>Problem + C++ Editor]
    UI --> Execute[/api/execute]
    Execute --> Compile[C++17 compilation<br/>with g++]
    Compile --> Run[Execution per test case]
    Run --> Evaluate[Test case evaluation]
    Evaluate --> Results[Execution results]
    Results --> Analyze[/api/analyze]
    Analyze --> Rules[Deterministic analysis layer]
    Rules --> Diagnosis[Error DNA diagnosis]
    Diagnosis --> Feedback[Fingerprint + explanation<br/>+ signals + confidence + recommendation]
    Feedback --> History[localStorage submission history]
    History --> Dashboard[Progress dashboard<br/>patterns + learning trends]
```

Fallback view:

```text
Student
      ↓
Next.js UI / Problem + C++ Editor
      ↓
/api/execute
      ↓
C++17 Compilation + Execution
      ↓
Test Case Evaluation → Execution Results
      ↓
/api/analyze → Deterministic Analysis Layer
      ↓
Error DNA Diagnosis
      ↓
Fingerprint + Explanation + Signals + Confidence + Recommendation
      ↓
localStorage Submission History → Dashboard
```

## Example Workflow

```text
Wrong Submission
      ↓
Test Cases
      ↓
Execution Evidence
      ↓
AI Analysis Layer
      ↓
Error DNA Diagnosis
      ↓
Explanation + Recommendation
      ↓
Student Fixes Code
      ↓
Accepted
      ↓
Submission History
```

## Screenshots

The screenshots below show the implemented problem-solving and progress flows.

![Problem editor](screenshots/problem-editor.png)

![Error diagnosis](screenshots/error-diagnosis.png)

![Accepted submission](screenshots/accepted.png)

![Dashboard](screenshots/dashboard.png)

![Submission history](screenshots/history.png)

## Tech Stack

| Technology | Use in this project |
| --- | --- |
| Next.js 16 | App Router UI and API routes |
| React 19 | Interactive problem workspace and dashboard |
| TypeScript | Application, route, and data types |
| Tailwind CSS 4 | Styling through the Tailwind PostCSS plugin |
| Monaco Editor | C++ code editing experience |
| C++17 / g++ | Local compilation and submission execution |
| TypeScript analysis layer | Deterministic diagnosis in `/api/analyze` |
| Browser `localStorage` | Submission history and Error DNA aggregation |

## Getting Started

Prerequisites: Node.js, npm, and `g++` available at `/usr/bin/g++` for C++ execution.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the platform.

Validation commands:

```bash
npm run lint
npm run build
```

No environment variables are required by the current repository configuration.

## Educational Impact

ERROR DNA helps students study the cause behind an incorrect submission instead of repeatedly changing code until it passes. The combination of execution evidence, explainable signals, recommendations, and recurring fingerprints supports deliberate practice and reflection.

## Hackathon Relevance

- **Educational Impact:** Converts opaque judge outcomes into actionable learning feedback.
- **Creative Use of AI/ML:** Uses an explainable analysis layer to organize code and execution evidence into error diagnoses; the current implementation does not claim a trained model.
- **Technical Execution:** Connects a Next.js editor, API routes, local C++17 compilation, isolated temporary execution, multi-case evaluation, diagnosis, and browser-persisted progress.
- **Pitch/Demo:** The value is easy to show in one short loop: submit, understand the mistake, fix it, and see progress accumulate.

## Demo

The 2-minute demo shows:

```text
Wrong submission → AI diagnosis → correction → Accepted → Dashboard
```

## Future Work

- Replace or extend the deterministic analyzer with a trained or externally hosted model.
- Add authenticated, server-side student profiles and synced history.
- Expand the problem library and diagnosis patterns.
- Add richer longitudinal learning analytics.

## Closing Thought

> Traditional coding platforms judge the answer. ERROR DNA understands the mistake.
