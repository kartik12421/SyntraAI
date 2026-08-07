import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 1000, 10_000),
});

let lastConnectionError = "";

redis.on("connect", () => {
  lastConnectionError = "";
  console.log("redis connected");
});

redis.on("error", (err) => {
  if (err.message !== lastConnectionError) {
    lastConnectionError = err.message;
    console.error("[ioredis]", err.message);
  }
});

export default redis;
