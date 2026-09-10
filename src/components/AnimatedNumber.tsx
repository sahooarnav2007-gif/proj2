'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delayMs?: number;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1100,
  delayMs = 0,
  decimals = 0,
  className,
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setDisplay(0);
    let startTime: number | null = null;
    let raf = 0;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.max(0, Math.min((ts - startTime - delayMs) / duration, 1));
      const eased = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    rafRef.current = raf;

    return () => cancelAnimationFrame(raf);
  }, [value, duration, delayMs]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');

  return <span className={className}>{formatted}</span>;
};