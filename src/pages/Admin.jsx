import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Server, ScrollText, ShieldBan, ShieldCheck as ShieldOk } from "lucide-react";
import api from "../api/client";
import EditUserLimitsModal from "../components/EditUserLimitsModal";

function StatPill({ label, value }) {
  return (
    <div className="panel-card px-4 py-3">
      <p className="text-[11px] text-ink-faint font-mono uppercase tracking-wide">{label}</p>
      <p className="font-display font-semibold text-lg">{value}</p>
    </div>
  );
}

export default function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("users");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [servers, setServers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  async function loadAll() {
    const [s, u, sv, lg] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/servers"),
      api.get("/admin/logs"),
    ]);
    setStats(s.data);
    setUsers(u.data.users);
    setServers(sv.data.servers);
    setLogs(lg.data.logs);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function toggleSuspend(user) {
    await api.patch(`/admin/users/${user.id}`, { suspended: user.suspended ? 0 : 1 });
    loadAll();
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-display font-semibold text-2xl mb-6">{t("admin.title")}</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatPill label="Usuarios" value={stats.totalUsers} />
          <StatPill label="Servidores" value={stats.totalServers} />
          <StatPill label="Activos" value={stats.runningCount} />
          <StatPill label="Suspendidos" value={stats.suspended} />
          <StatPill label="RAM asignada" value={`${stats.ramAllocated} MB`} />
        </div>
      )}

      <div className="flex gap-1 mb-4 border-b border-border">
        {[
          { key: "users", icon: Users, label: t("admin.users") },
          { key: "servers", icon: Server, label: t("admin.servers") },
          { key: "logs", icon: ScrollText, label: t("admin.logs") },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              tab === key ? "border-primary text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="panel-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-ink-faint font-mono uppercase border-b border-border">
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">{t("admin.role")}</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">RAM / CPU / Storage</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-elevated/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.username}</p>
                    <p className="text-ink-faint text-xs">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.role}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.plan}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                    {u.max_ram_mb}MB / {u.max_cpu_percent}% / {u.max_storage_mb}MB
                  </td>
                  <td className="px-4 py-3">
                    {u.suspended ? (
                      <span className="text-signal-danger text-xs font-mono">suspendido</span>
                    ) : (
                      <span className="text-signal-online text-xs font-mono">activo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="btn-ghost text-xs px-2.5 py-1.5"
                    >
                      {t("admin.limits")}
                    </button>
                    <button
                      onClick={() => toggleSuspend(u)}
                      className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1"
                    >
                      {u.suspended ? <ShieldOk size={13} /> : <ShieldBan size={13} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "servers" && (
        <div className="panel-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-ink-faint font-mono uppercase border-b border-border">
                <th className="px-4 py-3">Servidor</th>
                <th className="px-4 py-3">Dueño</th>
                <th className="px-4 py-3">Runtime</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-elevated/50">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.owner_username}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.runtime}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "logs" && (
        <div className="panel-card p-4 font-mono text-xs space-y-1.5 max-h-[500px] overflow-y-auto">
          {logs.map((l) => (
            <div key={l.id} className="text-ink-muted">
              <span className="text-ink-faint">{l.created_at}</span> · {l.action}
            </div>
          ))}
        </div>
      )}

      {editingUser && (
        <EditUserLimitsModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={() => {
            setEditingUser(null);
            loadAll();
          }}
        />
      )}
    </div>
  );
}
