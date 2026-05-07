import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockConversations } from "../services/mockMessages.js";

import ConversationThread from "../features/Inbox/components/ConversationThread.jsx";
import MessageBubble from "../features/Inbox/components/MessageBubble.jsx";
import MessageComposer from "../features/Inbox/components/MessageComposer.jsx";

export default function Inbox() {
  const [showConversationList, setShowConversationList] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [conversations, setConversations] = useState(mockConversations);

  const activeConversation = conversations.find(
    (convo) => convo.id === activeConversationId,
  );

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text: text,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedConversations = conversations.map((convo) => {
      if (convo.id === activeConversationId) {
        return {
          ...convo,
          messages: [...convo.messages, newMessage],
        };
      }
      return convo;
    });

    setConversations(updatedConversations);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Vänster sida */}
      {showConversationList && (
        <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto flex flex-col bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Mina meddelanden
          </h2>

          <ul className="flex-1">
            {mockConversations.map((convo) => (
              <li
                key={convo.id}
                onClick={() => setActiveConversationId(convo.id)}
                className={`p-3 mb-2 border rounded cursor-pointer transition-colors ${
                  activeConversationId === convo.id
                    ? "bg-blue-100 border-blue-300"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <p className="font-semibold text-gray-800">{convo.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {convo.lastMessage}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Höger sida */}
      <div className="flex-1 flex flex-col p-4 bg-gray-100 relative">
        <button
          onClick={() => setShowConversationList(!showConversationList)}
          className="absolute top-4 left-4 p-2 hover:bg-gray-200 rounded transition-colors z-10"
          aria-label="Toggle conversation list"
        >
          {showConversationList ? (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </button>

        <div className="flex-1 flex flex-col h-full pt-10">
          {activeConversation ? (
            <>
              <div className="pb-4 border-b mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {activeConversation.name}
                </h3>
              </div>

              <ConversationThread messages={activeConversation.messages} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Klicka på en chatt för att visa meddelanden.
            </div>
          )}
        </div>

        <MessageComposer
          disabled={!activeConversationId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
