import axios from "axios";

export const burnCredits = async (userId, agent, cookie) => {
  const url = `${process.env.AUTH_SERVICE_URL}/burn-credits`;
  try {
    const { data } = await axios.post(
      url,
      { userId, agent },
      { headers: cookie ? { Cookie: cookie } : {} },
    );
    return data;
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.message || error.message;
    console.error(`[burnCredits] POST ${url} -> ${status ?? "no response"} ${detail}`);
    const message =
      error.response?.data?.message ||
      `burn credits failed: POST ${url} -> ${status ?? "no response"} (${detail})`;
    throw new Error(message);
  }
};