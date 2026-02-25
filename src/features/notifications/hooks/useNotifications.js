import { useEffect, useMemo, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../../services/notificationService";

export function useNotifications({ limit = 20, pollMs = 15000 } = {}) {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
  try {
    setError("");
    setLoading(true);

    const res = await fetchNotifications({ limit });

    // Backend returnerar: { unreadCount, items }
    setUnreadCount(res?.unreadCount ?? 0);
    setItems(Array.isArray(res?.items) ? res.items : []);
  } catch (e) {
    setError(e?.message || "Kunde inte hämta notiser");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, pollMs]);

  async function markOneRead(id) {
   
    setItems((prev) =>
      prev.map((n) => (n._id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await markNotificationRead(id);
    } catch {
      // Om det failar: refetch så allt stämmer
      refresh();
    }
  }

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch {
      refresh();
    }
  }

  const hasUnread = unreadCount > 0;

  const sorted = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [items]);

  return {
    items: sorted,
    unreadCount,
    hasUnread,
    loading,
    error,
    refresh,
    markOneRead,
    markAllRead,
  };
}