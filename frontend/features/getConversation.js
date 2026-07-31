import api from "../utils/axios";

const getConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/get-conversation");
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "error in get conversation";
    console.error("get comversation error:", message);
    throw new Error(message, { cause: error });
  }
};

export default getConversation;
