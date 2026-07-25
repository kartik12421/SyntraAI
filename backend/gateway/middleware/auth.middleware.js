import redis from "../../shared/redis/redis.js";

const protectRoute = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(400).json({ message: "session expired" });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    return res.status(500).json({ message: `protect error: ${error.message}` });
  }
};

export default protectRoute;
