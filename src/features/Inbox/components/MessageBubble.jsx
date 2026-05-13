import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({
  text,
  time,
  isOwnMessage,
  isRead,
  readByCount,
  totalParticipants,
}) {
  return (
    <div
      className={`flex w-full mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isOwnMessage
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{text}</p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span
            className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}
          >
            {time}
          </span>
          {isOwnMessage && (
            <div className="flex items-center">
              {isRead ? (
                <CheckCheck className="h-3.5 w-3.5 text-blue-100" />
              ) : (
                <Check className="h-3.5 w-3.5 text-blue-100" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
