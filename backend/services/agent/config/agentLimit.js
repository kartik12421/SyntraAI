import redis from "../../../shared/redis/redis.js";

const LIMITS = {
  chat: 20,
  code: 5,
  pdf: 5,
  ppt: 5,
  imageGen: 5,
  search: 3,
};

export const checkAgentLimit = async (userId, agent) => {
  const max = LIMITS[agent] || LIMITS["chat"];
  const key = `rate:${userId}:${agent}`;
  const count = await redis.incr(key);
  if (count === 1) {    
    await redis.expire(key, 60);
  }

  const ttl = await redis.ttl(key);

  if (count > max) {
    const minuites = Math.floor(ttl / 60);
    const seconds = ttl % 60;
    const time =
      minuites > 0
        ? `${minuites} minuites : ${seconds} seconds`
        : `${seconds} seconds`;

    const error = new Error(`Rate limit exceed for ${agent}`);
    error.status = 429;
    error.data = {
      success: false,
      agent,
      limit: max,
      remainingTime: ttl,
      retryAfter: time,
      message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`,
    };

    throw error;
  }

  return {
    remaining: max - count,
    limit: max,
  };
};
