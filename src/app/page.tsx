"use client";

import React, { useEffect, useRef, useState } from "react";

function pad(n: number, size = 2) {
  return n.toString().padStart(size, "0");
}

function getColorClass(days: number) {
  if (days < 1) return "text-red-500";        // bad
  if (days < 3) return "text-orange-500";     // risky
  if (days < 7) return "text-yellow-400";     // okay
  if (days < 14) return "text-green-500";     // stable
  if (days < 30) return "text-blue-400";      // good
  return "text-purple-400";                   // legendary
}

function getColor(days: number) {
  if (days < 1) return "red";        // bad
  if (days < 3) return "orange";     // risky
  if (days < 7) return "yellow";     // okay
  if (days < 14) return "green";     // stable
  if (days < 30) return "blue";      // good
  return "purple";                   // legendary
}

function getColorNeg(days: number) {
  if (days < 1) return "red";        // bad
  if (days < 3) return "orange";     // risky
  if (days < 7) return "yellow";     // okay
  if (days < 14) return "green";     // stable
  if (days < 30) return "blue";      // good
  return "purple";                   // legendary
}

export default function DoomsdayCounterPage() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [lastIncident, setLastIncident] = useState<string>("2025-09-01T13:37:00Z");
  const [history, setHistory] = useState<string[]>(["2025-09-01T13:37:00Z"]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      setNow(new Date());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const then = new Date(lastIncident).getTime();
  const diff = Math.max(0, now.getTime() - then);

  // breakdown
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  const milliseconds = diff % 1000;

  // pretty strings
  const daysStr = days.toString();
  const hoursStr = pad(hours);
  const minutesStr = pad(minutes);
  const secondsStr = pad(seconds);
  const msStr = pad(milliseconds, 3);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the incident timer?")) {
      const newDate = new Date().toISOString();
      setLastIncident(newDate);
      setHistory((prev) => [newDate, ...prev]);
    }
  };

  const colorClass = getColorClass(days);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black overflow-auto">
      <div className="flex flex-col items-center gap-8 px-6 w-full max-w-4xl">
        <h1 className={`text-center text-3xl md:text-5xl tracking-widest uppercase pt-8 ${colorClass}`}>
          DAYS SINCE THE LAST INCIDENT
        </h1>

        <div className="relative flex items-center justify-center">
          <div className={`rounded-2xl p-8 md:p-14 shadow-2xl backdrop-blur-sm border`} style={{
            borderColor:getColor(days)
          }}>
            <div className={`font-mono text-center select-none ${colorClass}`}>
              <div className="text-[48px] md:text-[72px] lg:text-[96px] leading-tight font-extrabold tracking-tight">
                <span className="text-6xl md:text-8xl lg:text-9xl">{daysStr}</span>
                <span className="ml-4 text-xl md:text-2xl align-super">d</span>
              </div>

              <div className="mt-4 text-[20px] md:text-[28px] lg:text-[36px] font-semibold">
                <span className="mx-2">{hoursStr}</span>
                <span className="mx-1">:</span>
                <span className="mx-2">{minutesStr}</span>
                <span className="mx-1">:</span>
                <span className="mx-2">{secondsStr}</span>
                <span className="mx-1">.</span>
                <span className="mx-2">{msStr}</span>
              </div>

              <div className="mt-6 text-sm md:text-base opacity-80">
                Hours • Minutes • Seconds • Milliseconds
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-white rounded-md border border-[#440000] bg-[#1a0101] hover:bg-[#2a0505] text-sm md:text-base uppercase"
          >
            Reset
          </button>
        </div>

        {/* Legend */}
        <div className="mt-6 text-xs text-gray-400/70 w-full text-center">
          <p className="mb-2">Color Legend:</p>
          <ul className="flex flex-wrap justify-center gap-3">
            <li className="text-red-500">0–1d = Danger</li>
            <li className="text-orange-500">1–3d = Risky</li>
            <li className="text-yellow-400">3–7d = Improving</li>
            <li className="text-green-500">7–14d = Stable</li>
            <li className="text-blue-400">14–30d = Good</li>
            <li className="text-purple-400">30d+ = Legendary</li>
          </ul>
        </div>

        {/* History */}
        <div className="mt-6 text-xs text-gray-400/60 w-full text-center">
          <p className="mb-2">Incident history:</p>
          <ul className="space-y-1">
            {history.map((date, idx) => (
              <li key={idx}>{new Date(date).toUTCString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
