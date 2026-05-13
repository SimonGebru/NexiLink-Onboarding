import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import * as conversationService from "../services/getConversations.js";
import * as onboardingService from "../services/onboardingService.js";
import { getUser } from "../auth/auth.js";

import ConversationThread from "../features/Inbox/components/ConversationThread.jsx";
import MessageComposer from "../features/Inbox/components/MessageComposer.jsx";
import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  onMessageNew,
  offMessageNew,
  onConversationUpdated,
  offConversationUpdated,
} from "../services/socket.js";

export default function Inbox() {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;
  const currentUserRole = currentUser?.role;

  const [showConversationList, setShowConversationList] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [onboardings, setOnboardings] = useState([]);
  const [onboardingTitles, setOnboardingTitles] = useState({});
  const [selectedOnboarding, setSelectedOnboarding] = useState("");
  const [messageText, setMessageText] = useState("");

  // Hämta alla konversationer när inbox laddar
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await conversationService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error(
          "Fel vid hämtning av konversationer",
          error.response?.data || error.message,
        );
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Hämta onboardings när "Ny konversation" öppnas
  useEffect(() => {
    if (showNewConversation) {
      const fetchOnboardings = async () => {
        try {
          const data = await onboardingService.fetchOnboardings();
          const normalized = Array.isArray(data)
            ? data
                .map((entry) => entry?.onboarding ?? entry)
                .filter((entry) => entry?._id)
            : [];

          setOnboardings(normalized);
        } catch (error) {
          console.error("Fel vid hämtning av onboardings:", error);
        }
      };
      fetchOnboardings();
    }
  }, [showNewConversation]);

  useEffect(() => {
    const fetchOnboardingTitles = async () => {
      const onboardingIds = [
        ...new Set(
          conversations
            .map((convo) =>
              typeof convo.onboardingId === "string"
                ? convo.onboardingId
                : convo.onboardingId?._id,
            )
            .filter(Boolean),
        ),
      ];

      if (onboardingIds.length === 0) {
        return;
      }

      try {
        const results = await Promise.all(
          onboardingIds.map(async (id) => {
            const response = await onboardingService.fetchOnboardingById(id);
            const onboarding = response?.onboarding;
            const title = onboarding?.program?.name || "Onboarding";
            return [id, title];
          }),
        );

        setOnboardingTitles((prev) => ({
          ...prev,
          ...Object.fromEntries(results),
        }));
      } catch (error) {
        console.error("Fel vid hämtning av onboarding-titlar:", error);
      }
    };

    fetchOnboardingTitles();
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      const fetchMessages = async () => {
        try {
          const messagesData =
            await conversationService.getConversationMessages(
              activeConversationId,
            );
          // Uppdatera den specifika konversationen med meddelanden
          const updated = conversations.map((convos) =>
            convos._id === activeConversationId
              ? { ...convos, messages: messagesData.messages }
              : convos,
          );
          setConversations(updated);
        } catch (error) {
          console.error("Fel vid hämtning av meddelanden:", error);
        }
      };
      fetchMessages();
    }
  }, [activeConversationId]);

  // Visa markera som läst
  useEffect(() => {
    if (activeConversationId) {
      const markAsRead = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            return;
          }

          await conversationService.markConversationAsRead(
            activeConversationId,
          );
        } catch (error) {
          console.error("Fel vid läst:", {
            message: error.message,
            status: error.status,
            data: error.data,
          });
        }
      };
      markAsRead();
    }
  }, [activeConversationId]);

  // Socket connect och cleanup
  useEffect(() => {
    connectSocket();

    const handleNewMessage = (payload) => {
      const cid =
        payload?.conversationId ||
        payload?.conversation?._id ||
        payload?.conversation ||
        null;
      const message = payload?.message || payload;

      if (!cid || !message) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c._id !== cid) return c;

          const existing = (c.messages || []).some(
            (m) => m._id && message._id && m._id === message._id,
          );
          if (existing) return { ...c, lastMessage: message.body || message };

          return {
            ...c,
            messages: [...(c.messages || []), message],
            lastMessage: message.body || message,
          };
        }),
      );
    };

    const handleConversationUpdated = (payload) => {
      const convo = payload?.conversation || payload;
      if (!convo?._id) return;

      setConversations((prev) => {
        const exists = prev.some((c) => c._id === convo._id);
        if (exists) {
          return prev.map((c) =>
            c._id === convo._id ? { ...c, ...convo } : c,
          );
        }
        return [convo, ...prev];
      });
    };

    onMessageNew(handleNewMessage);
    onConversationUpdated(handleConversationUpdated);

    return () => {
      offMessageNew(handleNewMessage);
      offConversationUpdated(handleConversationUpdated);
      disconnectSocket();
    };
  }, []);

  // Join/lämna rum
  useEffect(() => {
    if (!activeConversationId) return;

    joinConversation(activeConversationId);

    return () => {
      leaveConversation(activeConversationId);
    };
  }, [activeConversationId]);

  const activeConversation = conversations.find(
    (convo) => convo._id === activeConversationId,
  );

  const getConversationDisplayName = (convo) => {
    const participants = Array.isArray(convo.participants)
      ? convo.participants
      : [];

    const otherParticipant = participants.find((participant) => {
      const participantId = participant?._id || participant?.id;
      return participantId && participantId !== currentUserId;
    });

    const otherName =
      otherParticipant?.name || otherParticipant?.email || "Okänd användare";

    if (currentUserRole === "employee") {
      return otherName;
    }

    const onboardingId =
      typeof convo.onboardingId === "string"
        ? convo.onboardingId
        : convo.onboardingId?._id;
    const onboardingTitle = onboardingId ? onboardingTitles[onboardingId] : "";

    return onboardingTitle ? `${otherName} - ${onboardingTitle}` : otherName;
  };

  const handleSendMessage = async (text) => {
    try {
      const { message } = await conversationService.sendMessage(
        activeConversationId,
        text,
      );

      // Uppdatera konversationen lokalt
      const updatedConversations = conversations.map((convo) => {
        if (convo._id === activeConversationId) {
          return {
            ...convo,
            lastMessage: text,
            messages: [...(convo.messages || []), message],
          };
        }
        return convo;
      });
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Fel vid sändning av meddelande:", error);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedOnboarding || selectedOnboarding === "-") {
      alert("Välj ett giltigt onboarding");
      return;
    }

    if (!selectedOnboarding || !messageText.trim()) {
      alert("Välj ett onboarding och skriv ett meddelande");
      return;
    }

    try {
      const response = await conversationService.sendOnboardingMessage(
        selectedOnboarding,
        messageText,
      );

      const data = await conversationService.getConversations();
      setConversations(data);

      // Rensa formuläret
      setSelectedOnboarding("");
      setMessageText("");
      setShowNewConversation(false);

      // Öppna den nya konversationen
      setActiveConversationId(response.conversation._id);
    } catch (error) {
      console.error("Fel vid start av konversation:", error);
      alert("Kunde inte starta konversation");
    }
  };

  if (loading) return <div>Laddar..</div>;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Vänster sida */}
      <div
        className={`${
          showConversationList ? "flex" : "hidden"
        } w-full md:w-80 flex-shrink-0 border-r border-gray-200 p-4 overflow-y-auto flex-col bg-gray-50`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mina meddelanden</h2>
          <button
            onClick={() => setShowNewConversation(true)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Ny konversation"
          >
            <Plus className="h-5 w-5 text-blue-600" />
          </button>
        </div>

        <ul className="flex-1">
          {conversations.map((convo) => (
            <li
              key={convo._id}
              onClick={() => {
                setActiveConversationId(convo._id);
                if (window.innerWidth < 768) {
                  setShowConversationList(false);
                }
              }}
              className={`p-3 mb-2 border rounded cursor-pointer transition-colors ${
                activeConversationId === convo._id
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold text-gray-800">
                {getConversationDisplayName(convo)}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {typeof convo.lastMessage === "string"
                  ? convo.lastMessage
                  : convo.lastMessage?.body || "Inga meddelanden än"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal för ny konversation */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ny konversation</h3>
              <button
                onClick={() => setShowNewConversation(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Välj onboarding
                </label>
                <select
                  value={selectedOnboarding}
                  onChange={(e) => setSelectedOnboarding(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Välj --</option>
                  {onboardings.map((onb) => (
                    <option key={onb._id} value={onb._id}>
                      {onb.program?.name || "Program"} -{" "}
                      {onb.employee?.fullName ||
                        onb.employee?.name ||
                        "Employee"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Startmeddelande
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Skriv ditt meddelande..."
                  className="w-full p-2 border rounded-lg resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleStartConversation}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Starta konversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Höger sida */}
      <div
        className={`${
          !showConversationList ? "flex" : "hidden md:flex"
        } flex-1 flex-col p-4 bg-gray-100 relative overflow-hidden`}
      >
        <button
          onClick={() => setShowConversationList(!showConversationList)}
          className={`absolute top-4 left-4 p-2 hover:bg-gray-200 rounded transition-colors z-10 ${
            showConversationList ? "hidden md:block" : "block"
          }`}
          aria-label="Toggle conversation list"
        >
          {showConversationList ? (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </button>

        <div className="flex-1 flex flex-col pt-10 min-h-0">
          {activeConversation ? (
            <>
              <div className="pb-4 border-b mb-4 flex-shrink-0 pl-12">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {getConversationDisplayName(activeConversation)}
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

        <div className="mt-4 flex-shrink-0">
          <MessageComposer
            disabled={!activeConversationId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
