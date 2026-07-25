import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Server, MemoryStick, HardDrive, Sparkles, Plus } from "lucide-react";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";
import ServerCard from "../components/ServerCard";
import CreateServerModal from "../components/CreateServerModal";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="panel-card p-4 flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-primary-glow" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-ink-faint font-mono uppercase tracking-wide">{label}</p>
        <p className="font-display font-semibold text-lg leading-tight">{value}</p>
        {sub && <p className="text-[11px] text-ink-faint">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function loadServers() {
    const { data } = await api.get("/servers");
    setServers(data.servers);
    setLoading(false);
  }

  useEffect(() => {
    loadServers();
  }, []);

  const onlineCount = servers.filter((s) => s.status === "online").length;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-semibold text-2xl">{t("dashboard.title")}</h1>
          <p className="text-sm text-ink-muted mt-0.5">{t("dashboard.subtitle")}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          {t("dashboard.newServer")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={Server}
          label={t("dashboard.totalServers")}
          value={`${servers.length} / ${user?.max_servers}`}
          sub={`${onlineCount} ${t("dashboard.online").toLowerCase()}`}
        />
        <StatCard icon={MemoryStick} label={t("dashboard.ramUsed")} value={`${user?.max_ram_mb} MB`} />
        <StatCard icon={HardDrive} label={t("dashboard.storage")} value={`${user?.max_storage_mb} MB`} />
        <StatCard icon={Sparkles} label={t("dashboard.plan")} value={user?.plan} />
      </div>

      {loading ? (
        <p className="text-ink-muted text-sm">{t("common.loading")}</p>
      ) : servers.length === 0 ? (
        <div className="panel-card p-10 text-center">
          <p className="text-ink-muted text-sm">{t("dashboard.noServers")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((s) => (
            <ServerCard key={s.id} server={s} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateServerModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadServers();
          }}
        />
      )}
    </div>
  );
}
