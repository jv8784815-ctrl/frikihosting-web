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
