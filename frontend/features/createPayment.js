import api from "../utils/axios";

export const createPayment = async (payload) => {
  try {
    const { data } = await api.post("/api/payment/create-order", payload);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "error in get conversation";
    throw new Error(message, { cause: error });
    return [];
  }
};
