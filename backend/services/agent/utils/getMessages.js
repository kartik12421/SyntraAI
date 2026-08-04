import axios from "axios";

export const getMessages = async (conversationId) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`,
    );
    return data;
  } catch (error) {
    throw new Error(`get messages failed: ${error.message}`);
  }
};
