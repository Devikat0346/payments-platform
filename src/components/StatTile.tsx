import type { LucideIcon } from "lucide-react";
import { InfoTip } from "./InfoTip";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  tooltip?: string;
  icon?: LucideIcon;
}

export function StatTile({ label, value, sublabel, tooltip, icon: Icon }: StatTileProps) {
  return (
    <div className="card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-muted text-xs font-medium uppercase tracking-wide inline-flex items-center gap-1">
          {label}
          {tooltip && <InfoTip text={tooltip} />}
        </span>
        {Icon && (
          <span className="icon-tile !w-7 !h-7 !rounded-lg">
            <Icon size={15} strokeWidth={2} />
          </span>
        )}
      </div>
      <span
        className="text-[1.75rem] font-semibold tracking-tight"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </span>
      {sublabel && <span className="text-secondary text-xs">{sublabel}</span>}
    </div>
  );
}
