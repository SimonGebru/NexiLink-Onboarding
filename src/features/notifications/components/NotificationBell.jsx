import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell({
  unreadCount = 0,
  items = [],
  loading = false,
  error = "",
  onMarkOneRead,
  onMarkAllRead,
  onRefresh,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
        aria-label="Notiser"
      >
        <Bell className="h-5 w-5 text-slate-700" />

        {unreadCount > 0 ? (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[90vw]">
          <NotificationPanel
            unreadCount={unreadCount}
            items={items}
            loading={loading}
            error={error}
            onMarkOneRead={onMarkOneRead}
            onMarkAllRead={onMarkAllRead}
            onRefresh={onRefresh}
          />
        </div>
      ) : null}
    </div>
  );
}