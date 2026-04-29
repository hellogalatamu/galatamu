'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date | string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  // Mencegah hydration mismatch dengan mengecek apakah komponen sudah di-mount di sisi klien
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
     
  }, []);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Fungsi pembantu untuk merender kotak angka
  const renderBox = (value: number | string, label: string) => (
    <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl w-16 h-16 sm:w-20 sm:h-20 shadow-sm">
      <span className="text-xl sm:text-2xl font-light text-slate-800">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</span>
    </div>
  );

  // Render state awal saat SSR untuk menghindari hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex gap-3 sm:gap-4 justify-center items-center">
        {renderBox('00', 'Hari')}
        {renderBox('00', 'Jam')}
        {renderBox('00', 'Menit')}
        {renderBox('00', 'Detik')}
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4 justify-center items-center">
      {renderBox(timeLeft.days, 'Hari')}
      {renderBox(timeLeft.hours, 'Jam')}
      {renderBox(timeLeft.minutes, 'Menit')}
      {renderBox(timeLeft.seconds, 'Detik')}
    </div>
  );
}
