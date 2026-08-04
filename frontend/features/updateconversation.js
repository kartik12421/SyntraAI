import api from "../utils/axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await api.post("/api/chat/update-conversation", payload);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "error in update conversation";
    console.error("update conversation error:", message);
    throw new Error(message, { cause: error });
  }
};
