import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Folder, File, ArrowLeft, Upload, FolderUp, FolderPlus, Trash2, Save } from "lucide-react";
import api from "../api/client";

export default function FileExplorer({ serverId }) {
  const { t } = useTranslation();
  const [currentPath, setCurrentPath] = useState("/");
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null); // { path, content }
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  async function load(p = currentPath) {
    const { data } = await api.get(`/files/${serverId}/list`, { params: { path: p } });
    setEntries(data.entries);
    setCurrentPath(p);
  }

  useEffect(() => {
    load("/");
    // eslint-disable-next-line
  }, [serverId]);

  function joinPath(base, name) {
    return base.endsWith("/") ? `${base}${name}` : `${base}/${name}`;
  }

  async function openEntry(entry) {
    const p = joinPath(currentPath, entry.name);
    if (entry.isDir) {
      load(p);
    } else {
      const { data } = await api.get(`/files/${serverId}/read`, { params: { path: p } });
      setEditing({ path: p, content: data.content });
    }
  }

  async function saveFile() {
    await api.put(`/files/${serverId}/write`, { path: editing.path, content: editing.content });
    setEditing(null);
    load();
  }

  async function deleteEntry(entry, e) {
    e.stopPropagation();
    const p = joinPath(currentPath, entry.name);
    if (!confirm(`${t("common.delete")}: ${entry.name}?`)) return;
    await api.delete(`/files/${serverId}/delete`, { params: { path: p } });
    load();
  }

  async function createFolder() {
    const name = prompt(t("server.createFolder"));
    if (!name) return;
    await api.post(`/files/${serverId}/mkdir`, { path: joinPath(currentPath, name) });
    load();
  }

  // Sube archivos sueltos o una carpeta completa (tope de 3 GB por subida, ver backend).
  // Cuando el navegador selecciona una carpeta (webkitdirectory), cada File trae
  // "webkitRelativePath" (ej. "mi-carpeta/src/index.js"), que usamos para que el
  // backend reconstruya la misma estructura de subcarpetas en el servidor.
  async function handleUpload(e) {
    const files = e.target.files;
    if (!files.length) return;

    const relativePaths = Array.from(files).map((f) => f.webkitRelativePath || f.name);

    const formData = new FormData();
    formData.append("path", currentPath);
    formData.append("relativePaths", JSON.stringify(relativePaths));
    for (const f of files) formData.append("files", f);

    setUploading(true);
    try {
      await api.post(`/files/${serverId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      load();
    } catch (err) {
      if (err.response?.status === 413) {
        alert("Esa subida supera el límite de 3 GB. Divide la carpeta en partes más pequeñas.");
      } else {
        alert("No se pudo subir. Revisa la consola del backend para más detalles.");
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function goUp() {
    if (currentPath === "/" || currentPath === "") return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    load("/" + parts.join("/"));
  }

  if (editing) {
    return (
      <div className="panel-card h-[520px] flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-mono text-sm text-ink-muted truncate">{editing.path}</span>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} className="btn-ghost text-xs px-3 py-1.5">
              {t("common.cancel")}
            </button>
            <button onClick={saveFile} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Save size={13} /> {t("server.save")}
            </button>
          </div>
        </div>
        <textarea
          className="flex-1 bg-elevated font-mono text-[13px] p-4 outline-none resize-none text-ink"
          value={editing.content}
          onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="panel-card h-[520px] flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={goUp} disabled={currentPath === "/"} className="text-ink-faint hover:text-ink disabled:opacity-30">
            <ArrowLeft size={15} />
          </button>
          <span className="font-mono text-xs text-ink-muted truncate">{currentPath}</span>
        </div>
        <div className="flex items-center gap-2.5">
          {uploading && (
            <span className="text-[11px] font-mono text-primary-glow animate-pulse">
              subiendo...
            </span>
          )}
          <div className="flex gap-1.5">
            <button onClick={createFolder} className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5">
              <FolderPlus size={13} />
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5"
              title="Subir archivos sueltos"
            >
              <Upload size={13} /> {t("server.upload")}
            </button>
            <button
              onClick={() => folderInputRef.current.click()}
              className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5"
              title="Subir una carpeta completa"
            >
              <FolderUp size={13} /> Subir carpeta
            </button>
            <input ref={fileInputRef} type="file" multiple hidden onChange={handleUpload} />
            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              hidden
              onChange={handleUpload}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 && (
          <p className="text-ink-faint text-sm p-4 font-mono">// carpeta vacía</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.name}
            onClick={() => openEntry(entry)}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-elevated cursor-pointer border-b border-border/50 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {entry.isDir ? (
                <Folder size={15} className="text-primary-glow shrink-0" />
              ) : (
                <File size={15} className="text-ink-faint shrink-0" />
              )}
              <span className="text-sm truncate">{entry.name}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {!entry.isDir && (
                <span className="text-[11px] font-mono text-ink-faint">
                  {(entry.size / 1024).toFixed(1)} KB
                </span>
              )}
              <button
                onClick={(e) => deleteEntry(entry, e)}
                className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-signal-danger transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
