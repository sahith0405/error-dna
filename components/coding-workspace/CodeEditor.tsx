"use client";

import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({
  value,
  onChange,
}: CodeEditorProps) {
  return (
    <div className="h-full min-h-[500px] overflow-hidden bg-[#1e1e1e]">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#181818] px-4">
        <span className="font-mono text-xs text-white/55">
          solution.cpp
        </span>

        <span className="font-mono text-xs text-white/35">
          C++17
        </span>
      </div>

      <Editor
        height="calc(100% - 40px)"
        defaultLanguage="cpp"
        value={value}
        onChange={(value) => onChange(value ?? "")}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          lineHeight: 22,
          padding: {
            top: 16,
            bottom: 16,
          },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "off",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
      />
    </div>
  );
}
