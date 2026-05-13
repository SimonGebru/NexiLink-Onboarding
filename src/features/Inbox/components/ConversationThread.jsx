import { useEffect, useRef } from "react";
import { getUser } from "../../../auth/auth.js";
import MessageBubble from "./MessageBubble.jsx";

export default function ConversationThread({ messages = [] }) {
  const user = getUser();
  const currentUserId = user?.id || user?._id;
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pr-4">
      {messages.map((msg) => {
        const isOwnMessage = msg.sender._id === currentUserId;
        const readByOthers =
          msg.readBy?.filter((id) => id !== currentUserId) || [];
        const isRead = readByOthers.length > 0;

        return (
          <MessageBubble
            key={msg._id}
            text={msg.body}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isOwnMessage={isOwnMessage}
            isRead={isRead}
            readByCount={msg.readBy?.length || 0}
          />
        );
      })}
    </div>
  );
}
