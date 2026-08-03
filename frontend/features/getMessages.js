import api from "../utils/axios"

async function getMessages(id) {
    try {
        let { data } = await api.get(`/get-messages/${id}`)
        return data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "get messages failed";
        console.error("get messages error:", message);
        throw new Error(message, { cause: error });
        return []
    }
}

export default getMessages
