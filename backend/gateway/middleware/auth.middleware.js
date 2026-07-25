import redis from "../../shared/redis/redis.js";

const protected = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(400).json({ mesage: "session expired" });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    return res.status(500).json({ mesage: `protect error: ${error.message}` });
  }
};
