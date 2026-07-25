import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus } from "lucide-react";
import api from "../api/client";

export default function ServerSettings({ server, onUpdated }) {
  const { t } = useTranslation();
  const [name, setName] = useState(server.name);
  const [entryFile, setEntryFile] = useState(server.entry_file);
  const [startCommand, setStartCommand] = useState(server.start_command || "");
  const [autoRestart, setAutoRestart] = useState(!!server.auto_restart);
  const [envVars, setEnvVars] = useState(Object.entries(JSON.parse(server.env_vars || "{}")));
  const [saved, setSaved] = useState(false);

  async function save(e) {
    e.preventDefault();
    const envObj = Object.fromEntries(envVars.filter(([k]) => k.trim()));
    await api.patch(`/servers/${server.id}`, {
      name,
      entry_file: entryFile,
      start_command: startCommand,
      auto_restart: autoRestart ? 1 : 0,
      env_vars: envObj,
    });
    setSaved(true);
    onUpdated();
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <form onSubmit={save} className="panel-card p-6 max-w-xl space-y-5">
      <div>
        <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">Nombre</label>
        <input className="input-field w-full mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
          {t("server.entryFile")}
        </label>
        <input
          className="input-field w-full mt-1.5 font-mono"
          value={entryFile}
          onChange={(e) => setEntryFile(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
          Comando de inicio (opcional)
        </label>
        <input
          className="input-field w-full mt-1.5 font-mono"
          placeholder="node index.js --flag"
          value={startCommand}
          onChange={(e) => setStartCommand(e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
            {t("server.envVars")}
          </label>
          <button
            type="button"
            onClick={() => setEnvVars([...envVars, ["", ""]])}
            className="text-primary-glow hover:text-primary text-xs flex items-center gap-1"
          >
            <Plus size={12} /> Añadir
          </button>
        </div>
        <div className="space-y-2">
          {envVars.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-field flex-1 font-mono text-xs"
                placeholder="CLAVE"
                value={k}
                onChange={(e) => {
                  const copy = [...envVars];
                  copy[i][0] = e.target.value;
                  setEnvVars(copy);
                }}
              />
              <input
                className="input-field flex-1 font-mono text-xs"
                placeholder="valor"
                value={v}
                onChange={(e) => {
                  const copy = [...envVars];
                  copy[i][1] = e.target.value;
                  setEnvVars(copy);
                }}
              />
              <button
                type="button"
                onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
                className="text-ink-faint hover:text-signal-danger px-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={autoRestart}
          onChange={(e) => setAutoRestart(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        {t("server.autoRestart")}
      </label>

      <button type="submit" className="btn-primary">
        {saved ? "✓ Guardado" : t("server.save")}
      </button>
    </form>
  );
}
