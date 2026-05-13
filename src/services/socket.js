import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export function joinConversation(conversationId) {
  socket.emit("conversation:join", conversationId);
}

export function leaveConversation(conversationId) {
  socket.emit("conversation:leave", conversationId);
}

export function onMessageNew(handler) {
  socket.on("message:new", handler);
}

export function offMessageNew(handler) {
  socket.off("message:new", handler);
}

export function onConversationUpdated(handler) {
  socket.on("conversation:updated", handler);
}

export function offConversationUpdated(handler) {
  socket.off("conversation:updated", handler);
}
