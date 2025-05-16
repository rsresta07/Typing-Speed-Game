"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccuracyMeter } from "@/app/components/AccuracyMeter";
import { TextPrompt } from "@/app/components/TextPrompt";
import { Timer } from "@/app/components/Timer";
import { levenshteinDistance } from "../../lib/levenshtein";

interface Result {
  id?: number;
  score: number;
  accuracy: number;
  wpm: number;
  createdAt?: string;
}

export default function TypingGame() {
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Result[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch prompt from API
  async function fetchPrompt() {
    try {
      const res = await fetch("/api/sentence");
      if (!res.ok) throw new Error("Failed to fetch sentence");
      const data = await res.json();
      setPrompt(data.sentence);
      setInput("");
      setAccuracy(100);
      setWpm(0);
      setTimeLeft(60);
      setIsRunning(true);
    } catch (e) {
      console.error(e);
      setPrompt("Error loading sentence. Please refresh.");
      setIsRunning(false);
    }
  }

  // Fetch leaderboard
  async function fetchLeaderboard() {
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setLeaderboard(data);
    } catch (e) {
      console.error("Failed to fetch leaderboard:", e);
    }
  }

  // Save score
  async function saveScore(scoreData: Result) {
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });
      fetchLeaderboard();
    } catch (e) {
      console.error("Failed to save score:", e);
    }
  }

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      // On time up, save score
      const finalScoreData = {
        score,
        accuracy,
        wpm,
        createdAt: new Date().toISOString(),
      };
      saveScore(finalScoreData);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  // Calculate accuracy and WPM on input change
  useEffect(() => {
    if (!prompt) return;

    const dist = levenshteinDistance(input.trim(), prompt.trim());
    const maxLen = Math.max(input.length, prompt.length) || 1;
    const acc = Math.max(0, 100 - (dist / maxLen) * 100);
    setAccuracy(Number(acc.toFixed(2)));

    // Calculate WPM based on input length & elapsed time
    const elapsedTime = 60 - timeLeft;
    if (elapsedTime > 0) {
      const wordsTyped = input.length / 5;
      const currentWpm = (wordsTyped / elapsedTime) * 60;
      setWpm(Number(currentWpm.toFixed(2)));
    } else {
      setWpm(0);
    }
  }, [input, prompt, timeLeft]);

  // Submit sentence, update score and fetch new prompt
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dist = levenshteinDistance(input.trim(), prompt.trim());
    const maxLen = Math.max(input.length, prompt.length) || 1;
    const acc = Math.max(0, 100 - (dist / maxLen) * 100);
    const addedScore = Math.round(acc);

    setScore((prev) => prev + addedScore);

    fetchPrompt();
  }

  // Restart game
  function handleRestart() {
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setTimeLeft(60);
    setInput("");
    setIsRunning(false);
    fetchPrompt();
    fetchLeaderboard();
  }

  useEffect(() => {
    fetchPrompt();
    fetchLeaderboard();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Typing Speed Game</h1>

      <Timer timeLeft={timeLeft} />

      <TextPrompt prompt={prompt} />

      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          className="w-full p-2 border rounded resize-none"
          placeholder="Start typing here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isRunning}
        />
        <button
          type="submit"
          disabled={!isRunning || input.trim().length === 0}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Submit Sentence
        </button>
      </form>

      <div className="space-y-2">
        <div>
          <span className="font-semibold">Score: </span>
          <span>{score}</span>
        </div>
        <div>
          <span className="font-semibold">Accuracy: </span>
          <span>{accuracy}%</span>
          <AccuracyMeter accuracy={accuracy} />
        </div>

        <div>
          <span className="font-semibold">Words Per Minute (WPM): </span>
          <span>{wpm}</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <Button
          onClick={() => setIsRunning(true)}
          disabled={isRunning || timeLeft === 0}
        >
          Start
        </Button>
        <Button variant="destructive" onClick={handleRestart}>
          Restart
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
          {leaderboard.length === 0 ? (
            <p>No results yet.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {leaderboard.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span>{new Date(r.createdAt!).toLocaleString()}</span>
                  <span>
                    Score: {r.score}, Accuracy: {r.accuracy}%, WPM: {r.wpm}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {!isRunning && timeLeft === 0 && (
        <div className="text-center text-xl font-bold text-red-600 mt-4">
          Time's up! Restart to play again.
        </div>
      )}
    </main>
  );
}
