import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({
  text,
  time,
  isOwnMessage,
  isRead,
  initials,
}) {
  return (
    <div
      className={`flex w-full items-end gap-3 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
          {initials}
        </div>
      )}

      <div
        className={`flex max-w-[65%] flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-base shadow-sm ${
            isOwnMessage
              ? "rounded-br-md bg-blue-500 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
          }`}
        >
          {text}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <span>{time}</span>

          {isOwnMessage && (
            <>
              <span>•</span>
              <span>{isRead ? "Läst" : "Skickat"}</span>
              {isRead ? (
                <CheckCheck className="h-4 w-4 text-blue-500" />
              ) : (
                <Check className="h-4 w-4 text-slate-400" />
              )}
            </>
          )}
        </div>
      </div>

      {isOwnMessage && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}