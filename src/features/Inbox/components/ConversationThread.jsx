import React from "react";
import MessageBubble from "./MessageBubble";

export default function ConversationThread({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white border border-gray-200 rounded-t-md">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          text={msg.text}
          time={msg.time}
          isOwnMessage={msg.sender === "me"}
        />
      ))}
    </div>
  );
}
