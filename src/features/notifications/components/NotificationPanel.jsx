function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "nyss";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `${days} d`;
}

export default function NotificationPanel({
  unreadCount,
  items,
  loading,
  error,
  onMarkOneRead,
  onMarkAllRead,
  onRefresh,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Notiser</p>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} olästa` : "Inga olästa"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Uppdatera
          </button>

          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs font-medium text-[#1A4D4F] hover:opacity-80"
            >
              Markera alla som lästa
            </button>
          ) : null}
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        {loading ? (
          <div className="p-4 text-sm text-slate-500">Hämtar notiser…</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">Inga notiser ännu.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((n) => {
              const isUnread = !n.readAt;
              return (
                <li key={n._id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {n.title || "Notis"}
                      </p>
                      {n.message ? (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      ) : null}
                      <p className="text-[11px] text-slate-400 mt-2">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {isUnread ? (
                        <span className="h-2 w-2 rounded-full bg-red-500 mt-1" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-transparent mt-1" />
                      )}

                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => onMarkOneRead?.(n._id)}
                          className="text-[11px] font-medium text-slate-600 hover:text-slate-900"
                        >
                          Markera läst
                        </button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}