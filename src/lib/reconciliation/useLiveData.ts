"use client";

import { useEffect, useRef, useState } from "react";
import { WS_URL, fetchBreaks, fetchRuns, fetchSummary } from "./api";
import { ReconciliationBreak, ReconciliationRun, ReconciliationSummary } from "./types";

const RECONNECT_DELAY_MS = 2000;
const MAX_BREAKS = 200;

export function useLiveData() {
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [runs, setRuns] = useState<ReconciliationRun[]>([]);
  const [breaks, setBreaks] = useState<ReconciliationBreak[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const refreshSummary = () => {
    fetchSummary()
      .then(setSummary)
      .catch(() => {
        // socket loop keeps retrying; a single failed poll isn't fatal
      });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [initialRuns, initialBreaks, initialSummary] = await Promise.all([
          fetchRuns(20),
          fetchBreaks(50),
          fetchSummary(),
        ]);
        if (cancelled) return;
        setRuns(initialRuns);
        setBreaks(initialBreaks);
        setSummary(initialSummary);
      } catch {
        // the websocket loop below will populate once the backend is reachable
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (cancelled) return;
      socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        if (!cancelled) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
      socket.onerror = () => socket?.close();

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "initial") {
          setRuns(msg.data.runs);
          setBreaks(msg.data.breaks);
        } else if (msg.type === "reconciliation_run") {
          const run: ReconciliationRun = msg.data.run;
          const newBreaks: ReconciliationBreak[] = msg.data.breaks;
          setRuns((prev) => [run, ...prev].slice(0, 20));
          setBreaks((prev) => [...newBreaks, ...prev].slice(0, MAX_BREAKS));
          refreshSummary();
        }
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  return { summary, runs, breaks, connected };
}
