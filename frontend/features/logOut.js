import api from "../utils/axios.js";

async function logOut() {
  try {
    const { data } = await api.get("/api/auth/logout");
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "LogOut failed";
    console.error("LogOut error:", message);
    throw new Error(message, { cause: error });
  }
}

export default logOut;
