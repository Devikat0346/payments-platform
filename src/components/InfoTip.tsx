export function InfoTip({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px] cursor-help shrink-0"
      style={{ background: "var(--border)", color: "var(--text-secondary)" }}
      title={text}
      aria-label={text}
    >
      ?
    </span>
  );
}
