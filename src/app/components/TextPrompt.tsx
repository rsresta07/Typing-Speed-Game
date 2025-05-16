import React from "react";

interface TextPromptProps {
  prompt: string;
}

export function TextPrompt({ prompt }: TextPromptProps) {
  return (
    <p className="p-4 border rounded bg-gray-50 text-lg select-text whitespace-pre-wrap min-h-[60px]">
      {prompt}
    </p>
  );
}
