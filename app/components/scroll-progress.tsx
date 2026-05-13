"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setProgress(0);
        return;
      }

      setProgress(window.scrollY / scrollableHeight);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-0.5 w-full bg-neutral-200/70 dark:bg-neutral-900"
    >
      <div
        className="h-full origin-left bg-red-500 transition-transform duration-150 ease-out dark:bg-red-400"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
