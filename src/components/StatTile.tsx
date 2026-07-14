import { InfoTip } from "./InfoTip";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  tooltip?: string;
}

export function StatTile({ label, value, sublabel, tooltip }: StatTileProps) {
  return (
    <div className="card p-5 flex flex-col gap-1">
      <span className="text-muted text-sm inline-flex items-center gap-1">
        {label}
        {tooltip && <InfoTip text={tooltip} />}
      </span>
      <span className="text-3xl font-semibold tracking-tight">{value}</span>
      {sublabel && <span className="text-secondary text-xs">{sublabel}</span>}
    </div>
  );
}
