import api from "../utils/axios";

export const createPayment = async (plan) => {
  try {
    const { data } = await api.post("/api/payment/create-order", {plan});
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
