// components/CountdownTimer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

interface CountdownTimerProps {
  startDate: string;
}

export default function CountdownTimer({ startDate }: CountdownTimerProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startDate);

      setTime({
        days: differenceInDays(now, start),
        hours: differenceInHours(now, start) % 24,
        minutes: differenceInMinutes(now, start) % 60,
        seconds: differenceInSeconds(now, start) % 60,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="grid grid-cols-4 justify-center gap-3">
      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-lg h-20  flex items-center justify-center">
          {time.days}
        </div>
        <span className="text-sm text-gray-500 mt-1">Ngày</span>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-br from-pink-400 to-rose-400 text-white rounded-lg h-20 flex items-center justify-center">
          {time.hours}
        </div>
        <span className="text-sm text-gray-500 mt-1">Giờ</span>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-br from-pink-300 to-rose-300 text-white rounded-lg h-20 flex items-center justify-center">
          {time.minutes}
        </div>
        <span className="text-sm text-gray-500 mt-1">Phút</span>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-br from-pink-200 to-rose-200 text-white rounded-lg h-20 flex items-center justify-center">
          {time.seconds}
        </div>
        <span className="text-sm text-gray-500 mt-1">Giây</span>
      </div>
    </div>
  );
}
