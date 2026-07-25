import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import api from "../api/client";

const STREAM_COLOR = {
  stdout: "text-ink",
  stderr: "text-signal-danger",
  system: "text-primary-glow",
};

export default function Console({ serverId, logs }) {
  const { t } = useTranslation();
  const [command, setCommand] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  async function sendCommand(e) {
    e.preventDefault();
    if (!command.trim()) return;
    await api.post(`/servers/${serverId}/command`, { command });
    setCommand("");
  }

  return (
    <div className="panel-card flex flex-col h-[520px]">
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
        {logs.length === 0 && <p className="text-ink-faint">// esperando salida del proceso...</p>}
        {logs.map((l, i) => (
          <div key={i} className={`${STREAM_COLOR[l.stream] || "text-ink"} whitespace-pre-wrap break-words`}>
            {l.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendCommand} className="border-t border-border p-3 flex gap-2">
        <input
          className="input-field flex-1 font-mono text-sm"
          placeholder="/comando"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <button type="submit" className="btn-primary px-3">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
