import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Play, Square, RotateCw, Hexagon } from "lucide-react";
import api from "../api/client";
import { useServerSocket } from "../hooks/useServerSocket";
import Console from "../components/Console";
import FileExplorer from "../components/FileExplorer";
import UsageBar from "../components/UsageBar";
import ServerSettings from "../components/ServerSettings";

const STATUS_COLOR = {
  online: "text-signal-online",
  offline: "text-ink-faint",
  starting: "text-signal-warn",
  crashed: "text-signal-danger",
};

export default function ServerDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [server, setServer] = useState(null);
  const [tab, setTab] = useState("console");
  const [busy, setBusy] = useState(false);
  const { logs, status, usage } = useServerSocket(id);

  async function load() {
    const { data } = await api.get(`/servers/${id}`);
    setServer(data.server);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [id]);

  async function action(type) {
    setBusy(true);
    await api.post(`/servers/${id}/${type}`);
    setTimeout(() => {
      load();
      setBusy(false);
    }, 700);
  }

  if (!server) return <div className="p-8 text-ink-muted">{t("common.loading")}</div>;

  const liveStatus = status || server.status;
  const color = STATUS_COLOR[liveStatus] || "text-ink-faint";

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <Link to="/servers" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> {t("nav.servers")}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Hexagon size={32} className={color} strokeWidth={1.5} />
          <div>
            <h1 className="font-display font-semibold text-xl">{server.name}</h1>
            <p className={`text-xs font-mono uppercase ${color}`}>{t(`dashboard.${liveStatus}`)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => action("start")}
            disabled={busy || liveStatus === "online"}
            className="btn-ghost flex items-center gap-1.5 text-sm disabled:opacity-30"
          >
            <Play size={14} /> {t("server.start")}
          </button>
          <button
            onClick={() => action("restart")}
            disabled={busy}
            className="btn-ghost flex items-center gap-1.5 text-sm disabled:opacity-30"
          >
            <RotateCw size={14} /> {t("server.restart")}
          </button>
          <button
            onClick={() => action("stop")}
            disabled={busy || liveStatus === "offline"}
            className="btn-ghost flex items-center gap-1.5 text-sm text-signal-danger disabled:opacity-30"
          >
            <Square size={14} /> {t("server.stop")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="panel-card p-3.5">
          <UsageBar label={t("server.cpu")} value={usage.cpu} max={server.cpu_limit_percent} unit="%" />
        </div>
        <div className="panel-card p-3.5">
          <UsageBar label={t("server.ram")} value={usage.memMb} max={server.ram_limit_mb} unit="MB" color="online" />
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-border">
        {["console", "files", "settings"].map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === tb ? "border-primary text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t(`server.${tb}`)}
          </button>
        ))}
      </div>

      {tab === "console" && <Console serverId={id} logs={logs} />}
      {tab === "files" && <FileExplorer serverId={id} />}
      {tab === "settings" && <ServerSettings server={server} onUpdated={load} />}
    </div>
  );
}
