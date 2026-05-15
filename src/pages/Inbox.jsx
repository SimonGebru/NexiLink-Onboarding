import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  Check,
  MoreVertical,
  Plus,
  Search,
  User,
} from "lucide-react";
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

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date) => {
  if (!date) return "Saknas";

  return new Date(date).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Inbox() {
  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;
  const currentUserRole = currentUser?.role;

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [onboardings, setOnboardings] = useState([]);
  const [onboardingTitles, setOnboardingTitles] = useState({});
  const [onboardingDetails, setOnboardingDetails] = useState({});
  const [activeOnboardingData, setActiveOnboardingData] = useState(null);
  const [selectedOnboarding, setSelectedOnboarding] = useState("");
  const [messageText, setMessageText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getOtherParticipant = (convo) => {
    const participants = Array.isArray(convo?.participants)
      ? convo.participants
      : [];

    return participants.find((participant) => {
      const participantId = participant?._id || participant?.id;
      return participantId && participantId !== currentUserId;
    });
  };

  const getOnboardingId = (convo) =>
    typeof convo?.onboardingId === "string"
      ? convo.onboardingId
      : convo?.onboardingId?._id;

  const getConversationDisplayName = (convo) => {
    const otherParticipant = getOtherParticipant(convo);

    return (
      otherParticipant?.name || otherParticipant?.email || "Okänd användare"
    );
  };

  const getConversationSubtitle = (convo) => {
    const onboardingId = getOnboardingId(convo);
    const cachedData = onboardingId ? onboardingDetails[onboardingId] : null;
    const cachedOnboarding = cachedData?.onboarding || null;

    return (
      cachedOnboarding?.program?.name ||
      onboardingTitles[onboardingId] ||
      "Onboarding"
    );
  };

  const activeConversation = conversations.find(
    (convo) => convo._id === activeConversationId,
  );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await conversationService.getConversations();

        setConversations(data);

        if (data?.length > 0) {
          setActiveConversationId(data[0]._id);
        }
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

  useEffect(() => {
    if (!showNewConversation) return;

    const fetchOnboardings = async () => {
      try {
        const data =
  currentUserRole === "employee"
    ? await onboardingService.fetchMyOnboardings()
    : await onboardingService.fetchOnboardings();

        const normalized = Array.isArray(data)
          ? data.map((entry) => entry?.onboarding ?? entry).filter(Boolean)
          : [];

        setOnboardings(normalized);
      } catch (error) {
        console.error("Fel vid hämtning av onboardings:", error);
      }
    };

    fetchOnboardings();
  }, [showNewConversation]);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      const onboardingIds = [
        ...new Set(
          conversations
            .map((convo) => getOnboardingId(convo))
            .filter(Boolean),
        ),
      ];

      if (onboardingIds.length === 0) return;

      try {
        const results = await Promise.all(
          onboardingIds.map(async (id) => {
            const response = await onboardingService.fetchOnboardingById(id);
            const payload = response?.data || response;

            return [
              id,
              {
                onboarding: payload?.onboarding || payload,
                progress: payload?.progress || null,
              },
            ];
          }),
        );

        const details = Object.fromEntries(results);

        setOnboardingDetails((prev) => ({
          ...prev,
          ...details,
        }));

        setOnboardingTitles((prev) => ({
          ...prev,
          ...Object.fromEntries(
            results.map(([id, data]) => [
              id,
              data?.onboarding?.program?.name || "Onboarding",
            ]),
          ),
        }));
      } catch (error) {
        console.error(
          "Fel vid hämtning av onboarding-data:",
          error.response?.data || error.message,
        );
      }
    };

    fetchOnboardingData();
  }, [conversations]);

  useEffect(() => {
    const fetchActiveOnboarding = async () => {
      if (!activeConversation) {
        setActiveOnboardingData(null);
        return;
      }

      const onboardingId = getOnboardingId(activeConversation);

      if (!onboardingId) {
        setActiveOnboardingData(null);
        return;
      }

      try {
        const response = await onboardingService.fetchOnboardingById(
          onboardingId,
        );
        const payload = response?.data || response;

        setActiveOnboardingData({
          onboarding: payload?.onboarding || payload,
          progress: payload?.progress || null,
        });
      } catch (error) {
        console.error(
          "Fel vid hämtning av aktiv onboarding:",
          error.response?.data || error.message,
        );

        setActiveOnboardingData(null);
      }
    };

    fetchActiveOnboarding();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const messagesData =
          await conversationService.getConversationMessages(
            activeConversationId,
          );

        setConversations((prev) =>
          prev.map((convo) =>
            convo._id === activeConversationId
              ? { ...convo, messages: messagesData.messages }
              : convo,
          ),
        );
      } catch (error) {
        console.error("Fel vid hämtning av meddelanden:", error);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;

    const markAsRead = async () => {
      try {
        await conversationService.markConversationAsRead(activeConversationId);

        setConversations((prev) =>
          prev.map((convo) =>
            convo._id === activeConversationId
              ? { ...convo, unreadCount: 0 }
              : convo,
          ),
        );
      } catch (error) {
        console.error("Fel vid läst:", error);
      }
    };

    markAsRead();
  }, [activeConversationId]);

  useEffect(() => {
    connectSocket();

    const handleNewMessage = (payload) => {
      const cid = payload?.conversationId;
      const message = payload?.message;

      if (!cid || !message) return;

      setConversations((prev) =>
        prev.map((convo) => {
          if (convo._id !== cid) return convo;

          const exists = (convo.messages || []).some(
            (item) => item._id === message._id,
          );

          return {
            ...convo,
            messages: exists
              ? convo.messages
              : [...(convo.messages || []), message],
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadCount:
              cid === activeConversationId ||
              message.sender?._id === currentUserId
                ? convo.unreadCount || 0
                : (convo.unreadCount || 0) + 1,
          };
        }),
      );
    };

    const handleConversationUpdated = (payload) => {
      const conversationId = payload?.conversationId;
      const lastMessage = payload?.lastMessage;

      if (!conversationId) return;

      setConversations((prev) =>
        prev.map((convo) =>
          convo._id === conversationId
            ? {
                ...convo,
                lastMessage,
                lastMessageAt: payload?.lastMessageAt,
              }
            : convo,
        ),
      );
    };

    onMessageNew(handleNewMessage);
    onConversationUpdated(handleConversationUpdated);

    return () => {
      offMessageNew(handleNewMessage);
      offConversationUpdated(handleConversationUpdated);
      disconnectSocket();
    };
  }, [activeConversationId, currentUserId]);

  useEffect(() => {
    if (!activeConversationId) return;

    joinConversation(activeConversationId);

    return () => {
      leaveConversation(activeConversationId);
    };
  }, [activeConversationId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((convo) => {
      const name = getConversationDisplayName(convo).toLowerCase();
      const subtitle = getConversationSubtitle(convo).toLowerCase();

      const matchesSearch =
        name.includes(searchValue.toLowerCase()) ||
        subtitle.includes(searchValue.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "unread") return (convo.unreadCount || 0) > 0;
      if (activeTab === "archived") return convo.status === "closed";

      return convo.status !== "closed";
    });
  }, [conversations, searchValue, activeTab, onboardingDetails]);

  const unreadTotal = conversations.reduce(
    (sum, convo) => sum + (convo.unreadCount || 0),
    0,
  );

  const handleSendMessage = async (text) => {
    try {
      const { message } = await conversationService.sendMessage(
        activeConversationId,
        text,
      );

      setConversations((prev) =>
        prev.map((convo) => {
          if (convo._id !== activeConversationId) return convo;

          const exists = (convo.messages || []).some(
            (item) => item._id === message._id,
          );

          return {
            ...convo,
            lastMessage: message,
            messages: exists
              ? convo.messages
              : [...(convo.messages || []), message],
            lastMessageAt: message.createdAt,
          };
        }),
      );
    } catch (error) {
      console.error("Fel vid sändning av meddelande:", error);
    }
  };

  const handleStartConversation = async () => {
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

      setSelectedOnboarding("");
      setMessageText("");
      setShowNewConversation(false);
      setActiveConversationId(response.conversation._id);
    } catch (error) {
      console.error("Fel vid start av konversation:", error);
      alert("Kunde inte starta konversation");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Laddar meddelanden...
      </div>
    );
  }

  const activeName = getConversationDisplayName(activeConversation);
  const activeSubtitle = activeConversation
    ? getConversationSubtitle(activeConversation)
    : "";

  const activeInitials = getInitials(activeName);
  const activeOnboarding = activeOnboardingData?.onboarding || null;
  const activeProgress = activeOnboardingData?.progress || null;
  const activeTasks = activeOnboarding?.tasks || [];

  const upcomingTasks = activeTasks
    .filter((task) => task.status !== "Klar")
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 3);

  return (
    <div className="fixed  left-[256px] right-0 top-[64px] bottom-[50px] z-10 flex min-w-0 overflow-hidden bg-white">
      <aside className="w-[360px] shrink-0 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Konversationer</h2>

            <button
              onClick={() => setShowNewConversation(true)}
              className="rounded-xl p-2 text-blue-600 transition hover:bg-blue-50"
              title="Ny konversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Sök konversationer..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="flex gap-3 border-b border-slate-200 px-4 py-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "all"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Alla ({conversations.length})
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "unread"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Olästa ({unreadTotal})
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "archived"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Arkiverade
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          {filteredConversations.map((convo) => {
            const name = getConversationDisplayName(convo);
            const subtitle = getConversationSubtitle(convo);

            const lastMessage =
              typeof convo.lastMessage === "string"
                ? convo.lastMessage
                : convo.lastMessage?.body || "Inga meddelanden än";

            const isActive = activeConversationId === convo._id;

            return (
              <button
                key={convo._id}
                onClick={() => setActiveConversationId(convo._id)}
                className={`relative flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition ${
                  isActive ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                )}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {getInitials(name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate font-bold text-slate-900">{name}</p>

                    <span className="shrink-0 text-sm text-slate-500">
                      {formatTime(convo.lastMessageAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-slate-500">
                    <Building2 className="h-3.5 w-3.5" />
                    {subtitle}
                  </p>

                  <p className="mt-2 truncate text-sm text-slate-700">
                    {lastMessage}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      Pågående onboarding
                    </span>

                    {(convo.unreadCount || 0) > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-bold text-white">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col border-r border-slate-200 bg-white">
        {activeConversation ? (
          <>
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
                  {activeInitials}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeName}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
  <Building2 className="h-4 w-4" />
  {activeOnboarding?.program?.name || activeSubtitle}
</span>

                    <span className="hidden md:inline">•</span>

                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Startdatum: {formatDate(activeOnboarding?.startDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div />
            </header>

            <div className="flex-1 overflow-hidden">
              <ConversationThread
                messages={activeConversation.messages || []}
                startedAt={activeConversation.createdAt}
              />
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
              <MessageComposer
                disabled={!activeConversationId}
                onSendMessage={handleSendMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-400">
            Klicka på en chatt för att visa meddelanden.
          </div>
        )}
      </main>

      <aside className="hidden w-[360px] shrink-0 overflow-y-auto bg-white p-6 xl:block">
        <h2 className="mb-5 text-2xl font-bold text-slate-900">
          Onboarding-information
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white">
              {activeInitials}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{activeName}</h3>

              <p className="text-slate-500">
                {currentUserRole === "employee"
                  ? "HR Manager"
                  : "Ny medarbetare"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600">
            <p className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-slate-500" />
              {activeOnboarding?.program?.name || activeSubtitle}
            </p>

            <p className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-500" />
              {activeOnboarding?.employee?.jobTitle || "Roll saknas"}
            </p>

            <p className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-500" />
              Startdatum: {formatDate(activeOnboarding?.startDate)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Onboarding-progress
            </h3>
          </div>

          <div className="mb-2 flex justify-between text-slate-600">
            <span>
              {activeProgress?.done ?? 0} av{" "}
              {activeProgress?.total ?? activeTasks.length} uppgifter klara
            </span>

            <span>{activeProgress?.percent ?? 0}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${activeProgress?.percent ?? 0}%` }}
            />
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="mb-3 font-medium text-slate-700">
              Kommande uppgifter:
            </p>

            {upcomingTasks.length > 0 ? (
              <ul className="space-y-3 text-sm text-slate-600">
                {upcomingTasks.map((task, index) => (
                  <li
                    key={task._id || task.title}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        index === 0 ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />

                    <span className="line-clamp-1">{task.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                Alla uppgifter är klara.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Deltagare</h3>

          <div className="space-y-4">
            {(activeConversation?.participants || []).map((participant) => (
              <div key={participant._id} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {getInitials(participant.name || participant.email)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">
                    {participant.name || participant.email}
                  </p>

                  <p className="text-sm text-slate-500">
                    {participant.role === "employee"
                      ? "Ny medarbetare"
                      : "HR Manager"}
                  </p>
                </div>

                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Snabbåtgärder
          </h3>

          <button
            onClick={() =>
              activeConversationId &&
              conversationService.markConversationAsRead(activeConversationId)
            }
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
          >
            <Check className="h-5 w-5 text-slate-500" />
            Markera som läst
          </button>
        </div>
      </aside>

      {showNewConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Ny konversation
              </h3>

              <button
                onClick={() => setShowNewConversation(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Välj onboarding
                </label>

                <select
                  value={selectedOnboarding}
                  onChange={(e) => setSelectedOnboarding(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Startmeddelande
                </label>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Skriv ditt meddelande..."
                  className="min-h-28 w-full resize-none rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50"
                >
                  Avbryt
                </button>

                <button
                  onClick={handleStartConversation}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Starta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
