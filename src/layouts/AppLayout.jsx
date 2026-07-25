import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Server, ShieldCheck, LogOut, Hexagon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LanguageSwitcher from "../components/LanguageSwitcher";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/15 text-primary-glow border border-primary/30"
            : "text-ink-muted hover:text-ink hover:bg-elevated border border-transparent"
        }`
      }
    >
      <Icon size={17} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-border bg-panel/60 backdrop-blur-sm flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-border">
          <div className="relative">
            <Hexagon className="text-primary" size={26} fill="rgba(124,92,255,0.15)" strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-online animate-pulse-node" />
            </span>
          </div>
          <div>
            <p className="font-display font-semibold text-[15px] tracking-tight leading-none">
              {t("brand")}
            </p>
            <p className="text-[11px] text-ink-faint font-mono mt-0.5">node cluster online</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/dashboard" icon={LayoutGrid} label={t("nav.dashboard")} />
          <NavItem to="/servers" icon={Server} label={t("nav.servers")} />
          {user?.role === "admin" && (
            <NavItem to="/admin" icon={ShieldCheck} label={t("nav.admin")} />
          )}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-3">
          <LanguageSwitcher />
          <div className="flex items-center justify-between px-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-[11px] text-ink-faint font-mono uppercase">{user?.plan}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 rounded-lg hover:bg-elevated text-ink-muted hover:text-signal-danger transition-colors"
              title={t("nav.logout")}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
