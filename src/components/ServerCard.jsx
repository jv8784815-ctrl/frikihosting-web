import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Hexagon, Cpu, MemoryStick } from "lucide-react";

const STATUS_COLOR = {
  online: "text-signal-online",
  offline: "text-ink-faint",
  starting: "text-signal-warn",
  crashed: "text-signal-danger",
};

const RUNTIME_LABEL = { node: "Node.js", python: "Python", java: "Java", custom: "Custom" };

export default function ServerCard({ server }) {
  const { t } = useTranslation();
  const color = STATUS_COLOR[server.status] || "text-ink-faint";

  return (
    <Link
      to={`/servers/${server.id}`}
      className="panel-card p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors animate-rise group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Hexagon size={28} className={color} strokeWidth={1.5} />
            <span className={`absolute inset-0 flex items-center justify-center`}>
              {server.status === "online" && (
                <span className="w-1.5 h-1.5 rounded-full bg-signal-online animate-pulse-node" />
              )}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display font-medium text-sm truncate group-hover:text-primary-glow transition-colors">
              {server.name}
            </p>
            <p className="text-[11px] text-ink-faint font-mono">{RUNTIME_LABEL[server.runtime]}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wide ${color}`}>
          {t(`dashboard.${server.status}`)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Cpu size={13} />
          <span className="text-xs font-mono">{server.cpu_limit_percent}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-ink-muted">
          <MemoryStick size={13} />
          <span className="text-xs font-mono">{server.ram_limit_mb} MB</span>
        </div>
      </div>
    </Link>
  );
}
