import api from "../utils/axios";

async function getMessages(id) {
  try {
    const { data } = await api.get(`/api/chat/get-messages/${id}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "get messages failed";
    throw new Error(message, { cause: error });
    return {};
  }
}

export default getMessages;
