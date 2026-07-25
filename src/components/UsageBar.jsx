export default function UsageBar({ label, value, max, unit, color = "primary" }) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0);
  const colorMap = {
    primary: "bg-primary",
    online: "bg-signal-online",
    warn: "bg-signal-warn",
    danger: "bg-signal-danger",
  };
  const barColor = pct > 90 ? colorMap.danger : pct > 70 ? colorMap.warn : colorMap[color];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wide text-ink-faint font-mono">{label}</span>
        <span className="text-xs font-mono text-ink-muted">
          {Math.round(value)}
          {unit} <span className="text-ink-faint">/ {max}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-elevated overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
