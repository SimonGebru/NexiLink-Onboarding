import { useEffect, useRef } from "react";
import { getUser } from "../../../auth/auth.js";
import MessageBubble from "./MessageBubble.jsx";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function ConversationThread({ messages = [], startedAt }) {
  const user = getUser();
  const currentUserId = user?.id || user?._id;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-y-auto bg-slate-50 px-7 py-6"
    >
      {startedAt && (
        <div className="mb-8 flex justify-center">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-500">
            Conversation startad{" "}
            {new Date(startedAt).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      <div className="space-y-7">
        {messages.map((msg) => {
          const senderId = msg.sender?._id || msg.sender;
          const isOwnMessage = senderId === currentUserId;

          const senderName =
            msg.sender?.name || msg.sender?.email || "Okänd användare";

          const readByOthers =
            msg.readBy?.filter((id) => id !== currentUserId) || [];

          return (
            <MessageBubble
              key={msg._id}
              text={msg.body}
              time={new Date(msg.createdAt).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              isOwnMessage={isOwnMessage}
              isRead={readByOthers.length > 0}
              initials={getInitials(senderName)}
            />
          );
        })}
      </div>
    </div>
  );
}
