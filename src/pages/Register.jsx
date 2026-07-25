import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Hexagon, UserPlus } from "lucide-react";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError(t("auth.registerError"));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch {
      setError(t("auth.registerError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-5 right-5">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm animate-rise">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <Hexagon className="text-primary" size={30} fill="rgba(124,92,255,0.15)" strokeWidth={1.5} />
          <span className="font-display font-semibold text-xl">{t("brand")}</span>
        </div>

        <div className="panel-card p-7">
          <h1 className="font-display font-semibold text-lg mb-1">{t("auth.createAccount")}</h1>
          <p className="text-sm text-ink-muted mb-6">{t("auth.registerSubtitle")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
                {t("auth.username")}
              </label>
              <input
                className="input-field w-full mt-1.5"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
                {t("auth.email")}
              </label>
              <input
                type="email"
                className="input-field w-full mt-1.5"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
                {t("auth.password")}
              </label>
              <input
                type="password"
                className="input-field w-full mt-1.5"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">
                {t("auth.confirmPassword")}
              </label>
              <input
                type="password"
                className="input-field w-full mt-1.5"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>

            {error && <p className="text-sm text-signal-danger">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <UserPlus size={16} />
              {t("auth.register")}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-muted mt-5">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-primary-glow hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
