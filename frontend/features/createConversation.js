import api from "../utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversation");
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "error in create conversation";
    console.error("create conversation error:", message);
    throw new Error(message, { cause: error });
  }
};
