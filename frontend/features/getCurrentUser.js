import api from "../utils/axios.js";

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/api/me");
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "current user not found";
    console.error("Get current user error:", message);
    throw new Error(message, { cause: error });
  }
};
