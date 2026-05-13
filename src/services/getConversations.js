import { apiRequest } from "../services/api.js";

export const getConversations = async () => {
  const response = await apiRequest("/api/conversations");
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await apiRequest(
    `/api/conversations/${conversationId}/messages`,
  );
  return response.data;
};

export const sendOnboardingMessage = async (onboardingId, body) => {
  const response = await apiRequest(
    `/api/conversations/${onboardingId}/message`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );
  return response.data;
};

export const sendMessage = async (conversationId, body) => {
  const response = await apiRequest(
    `/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );
  return response.data;
};

export const markConversationAsRead = async (conversationId) => {
  const response = await apiRequest(
    `/api/conversations/${conversationId}/read`,
    {
      method: "PATCH",
    },
  );
  return response;
};
