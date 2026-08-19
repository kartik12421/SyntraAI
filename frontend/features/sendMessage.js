import api from "../utils/axios";

async function sendMessage(payload) {
  try {
    const { data } = await api.post("/api/agent/chat", payload);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "send message failed";
    throw new Error(message, { cause: error });
    return null;
  }
}

export default sendMessage;
