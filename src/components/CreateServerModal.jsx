import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import api from "../api/client";

const RUNTIMES = [
  { value: "node", label: "Node.js", defaultEntry: "index.js" },
  { value: "python", label: "Python", defaultEntry: "main.py" },
  { value: "java", label: "Java", defaultEntry: "app.jar" },
  { value: "custom", label: "Custom", defaultEntry: "start.sh" },
];

export default function CreateServerModal({ onClose, onCreated }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [runtime, setRuntime] = useState("node");
  const [entryFile, setEntryFile] = useState("index.js");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/servers", { name, runtime, entry_file: entryFile });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error === "server.limit_reached" ? "Límite de servidores alcanzado para tu plan." : "No se pudo crear el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="panel-card w-full max-w-md p-6 animate-rise">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg">{t("dashboard.newServer")}</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">Nombre</label>
            <input
              className="input-field w-full mt-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mi-bot-de-discord"
              required
            />
          </div>

          <div>
            <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
              {t("server.runtime")}
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {RUNTIMES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => {
                    setRuntime(r.value);
                    setEntryFile(r.defaultEntry);
                  }}
                  className={`text-xs font-mono py-2 rounded-lg border transition-colors ${
                    runtime === r.value
                      ? "bg-primary/15 border-primary/40 text-primary-glow"
                      : "bg-elevated border-border text-ink-muted hover:text-ink"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
              {t("server.entryFile")}
            </label>
            <input
              className="input-field w-full mt-1.5 font-mono"
              value={entryFile}
              onChange={(e) => setEntryFile(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-signal-danger">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
