"use client";

import { useEffect, useRef, useState } from "react";

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideInteraction(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("keydown", handleOutsideInteraction);
    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("keydown", handleOutsideInteraction);
    };
  }, [open]);

  return (
    <span ref={containerRef} className="relative inline-flex" style={{ verticalAlign: "middle" }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px] leading-none shrink-0"
        style={{ background: "var(--border)", color: "var(--text-secondary)" }}
        aria-label={open ? "Hide explanation" : text}
        aria-expanded={open}
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1.5 text-xs rounded-md px-2.5 py-2 shadow-lg"
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            width: "max-content",
            maxWidth: "16rem",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
