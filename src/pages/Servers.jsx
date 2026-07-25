import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import api from "../api/client";
import ServerCard from "../components/ServerCard";
import CreateServerModal from "../components/CreateServerModal";

export default function Servers() {
  const { t } = useTranslation();
  const [servers, setServers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    const { data } = await api.get("/servers");
    setServers(data.servers);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-semibold text-2xl">{t("nav.servers")}</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          {t("dashboard.newServer")}
        </button>
      </div>

      {servers.length === 0 ? (
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
            load();
          }}
        />
      )}
    </div>
  );
}
