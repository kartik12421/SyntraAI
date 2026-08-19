import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

const cacheTtlSeconds = 24 * 60 * 60;

const readCache = async (key) => {
  if (redis.status !== "ready") {
    return null;
  }

  try {
    return await redis.get(key);
  } catch (error) {
    // Redis is only a cache. Conversations remain available through the chat
    // service, so an unavailable cache must not block a model response.
    console.warn(`memory cache read failed: ${error.message}`);
    return null;
  }
};

const writeCache = async (key, messages) => {
  if (redis.status !== "ready") {
    return;
  }

  try {
    await redis.set(key, JSON.stringify(messages), "EX", cacheTtlSeconds);
  } catch (error) {
    console.warn(`memory cache write failed: ${error.message}`);
  }
};

export const getMemory = async (conversationId) => {
  const key = `messages-${conversationId}`;
  const cached = await readCache(key);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.warn(`memory cache parse failed: ${error.message}`);
    }
  }

  const messages = await getMessages(conversationId);
  await writeCache(key, messages);

  return messages;
};

export const addMessages = async (conversationId, role, content) => {
  const key = `messages-${conversationId}`;
  const rawMessages = await readCache(key);
  let messages = [];

  if (rawMessages) {
    try {
      messages = JSON.parse(rawMessages);
    } catch (error) {
      console.warn(`memory cache parse failed: ${error.message}`);
    }
  }

  messages.push({
    role,
    content,
  });

  if (messages.length > 20) {
    messages.shift();
  }

  await writeCache(key, messages);
};
