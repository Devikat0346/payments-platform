"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
      style={{ background: "color-mix(in srgb, black 55%, transparent)" }}
      onClick={onClose}
    >
      <div
        className="card w-full max-w-2xl mt-12 mb-12 p-0 overflow-hidden"
        style={{ boxShadow: "var(--shadow-raised)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 hover:bg-[var(--border)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
