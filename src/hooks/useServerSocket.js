import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

let sharedSocket = null;

function getSocket(token) {
  if (!sharedSocket) {
    const url = import.meta.env.VITE_API_URL || "/";
    sharedSocket = io(url, { auth: { token }, autoConnect: true, transports: ["websocket"] });
  }
  return sharedSocket;
}

export function useServerSocket(serverId) {
  const token = useAuthStore((s) => s.token);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [usage, setUsage] = useState({ cpu: 0, memMb: 0 });
  const socketRef = useRef(null);

  useEffect(() => {
    if (!serverId || !token) return;
    const socket = getSocket(token);
    socketRef.current = socket;
    socket.emit("server:subscribe", serverId);

    const onLog = (payload) => {
      if (payload.serverId !== serverId) return;
      setLogs((prev) => [...prev.slice(-499), payload]);
    };
    const onStatus = (payload) => {
      if (payload.serverId !== serverId) return;
      setStatus(payload.status);
    };
    const onUsage = (payload) => {
      if (payload.serverId !== serverId) return;
      setUsage({ cpu: payload.cpu, memMb: payload.memMb });
    };

    socket.on("log", onLog);
    socket.on("status", onStatus);
    socket.on("usage", onUsage);

    return () => {
      socket.emit("server:unsubscribe", serverId);
      socket.off("log", onLog);
      socket.off("status", onStatus);
      socket.off("usage", onUsage);
    };
  }, [serverId, token]);

  return { logs, status, usage, clearLogs: () => setLogs([]) };
}
