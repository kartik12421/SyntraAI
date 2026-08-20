import axios from "axios";

export const burnCredits = async (userId, agent, cookie) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/burn-credits`,
      { userId, agent },
      { headers: cookie ? { Cookie: cookie } : {} },
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `burn credits failed: ${error.message}`;
    throw new Error(message);
  }
};