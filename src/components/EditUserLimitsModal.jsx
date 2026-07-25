import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/client";

export default function EditUserLimitsModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    plan: user.plan,
    max_ram_mb: user.max_ram_mb,
    max_cpu_percent: user.max_cpu_percent,
    max_storage_mb: user.max_storage_mb,
    max_servers: user.max_servers,
    role: user.role,
  });

  async function save(e) {
    e.preventDefault();
    await api.patch(`/admin/users/${user.id}`, form);
    onSaved();
  }

  function field(key, label, type = "number") {
    return (
      <div>
        <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">{label}</label>
        <input
          type={type}
          className="input-field w-full mt-1.5"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="panel-card w-full max-w-md p-6 animate-rise">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg">{user.username}</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">Plan</label>
            <input
              className="input-field w-full mt-1.5"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-ink-faint font-mono uppercase tracking-wide">Rol</label>
            <select
              className="input-field w-full mt-1.5"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("max_ram_mb", "RAM (MB)")}
            {field("max_cpu_percent", "CPU (%)")}
            {field("max_storage_mb", "Storage (MB)")}
            {field("max_servers", "Servidores")}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
