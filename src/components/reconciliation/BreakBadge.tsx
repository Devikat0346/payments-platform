import { Copy, FileX, Scale, Unlink, type LucideIcon } from "lucide-react";
import { BreakType } from "@/lib/reconciliation/types";

const BREAK_CONFIG: Record<BreakType, { label: string; icon: LucideIcon; color: string }> = {
  missing_settlement: { label: "Missing settlement", icon: FileX, color: "var(--status-critical)" },
  duplicate_settlement: { label: "Duplicate settlement", icon: Copy, color: "var(--status-serious)" },
  amount_mismatch: { label: "Amount mismatch", icon: Scale, color: "var(--status-warning)" },
  orphaned_settlement: { label: "Orphaned settlement", icon: Unlink, color: "var(--status-serious)" },
};

export function BreakBadge({ type }: { type: BreakType }) {
  const cfg = BREAK_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: `color-mix(in srgb, ${cfg.color} 14%, transparent)`, color: cfg.color }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

export { BREAK_CONFIG };
