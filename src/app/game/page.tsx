// Main game interface

"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Timer } from "@/app/components/Timer";
import { AccuracyMeter } from "@/app/components/AccuracyMeter";
import { TextPrompt } from "@/app/components/TextPrompt";

import { calculateAccuracy, calculateWPM } from "./logic";

const sampleSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing games improve your speed and accuracy.",
  "Next.js makes fullstack development easier.",
];

interface Result {
  score: number;
  accuracy: number;
  wpm: number;
}

export default function TypingGame() {
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [results, setResults] = useState<Result[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function saveScore(scoreData: {
    score: number;
    accuracy: number;
    wpm: number;
  }) {
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });
    } catch (e) {
      console.error("Failed to save score:", e);
    }
  }

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setStarted(false);

      const wpm = calculateWPM(wordCount, 60);
      const scoreData = { score, accuracy, wpm };

      setResults((prev) => [...prev, scoreData]);

      // Call saveScore here to send data to backend
      saveScore(scoreData);

      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started, timeLeft]);

  useEffect(() => {
    if (!started) {
      const rand =
        sampleSentences[Math.floor(Math.random() * sampleSentences.length)];
      setPrompt(rand);
    }
  }, [started]);

  const handleSubmit = () => {
    const acc = calculateAccuracy(input, prompt);
    const words = input.trim().split(/\s+/).length;

    setAccuracy(acc);
    setScore((prev) => prev + acc);
    setWordCount((prev) => prev + words);
    setInput("");
    setPrompt(
      sampleSentences[Math.floor(Math.random() * sampleSentences.length)]
    );
  };

  const handleRestart = () => {
    setTimeLeft(60);
    setScore(0);
    setAccuracy(100);
    setWordCount(0);
    setInput("");
    setStarted(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">Typing Speed Game</h1>
          <Timer timeLeft={timeLeft} />
          <p className="text-lg">Score: {score}</p>
          <p className="text-lg">Accuracy: {accuracy}%</p>
          <p className="text-lg">
            WPM: {Math.round(wordCount / ((60 - timeLeft || 1) / 60))}
          </p>
          <AccuracyMeter accuracy={accuracy} />
          <TextPrompt prompt={prompt} />
          <Input
            disabled={!started || timeLeft <= 0}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Start typing..."
          />
          <div className="flex gap-2">
            <Button onClick={() => setStarted(true)} disabled={started}>
              Start
            </Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={!started || timeLeft <= 0}
            >
              Submit
            </Button>
            <Button variant="destructive" onClick={handleRestart}>
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          {results.length === 0 ? (
            <p>No results yet.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((r, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>Attempt {i + 1}</span>
                  <span>
                    Score: {r.score}, Accuracy: {r.accuracy}%, WPM: {r.wpm}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
