import crypto from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        userid: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiredAt: user.planExpiredAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiredAt: user.planExpiredAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `LogIn failed: ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session");

    return res.status(200).json({ message: "logOut successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    const sessionId = req.cookies?.session;
    const session = await redis.get(`session:${sessionId}`);
    const parsed = session ? JSON.parse(session) : {};
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        ...parsed,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiredAt: user.planExpiredAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    return res
      .status(200)
      .json({ message: "User payment updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Update user payment failed: ${error.message}` });
  }
};

export const burnCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;
    const COST = {
      chat: 1,
      search: 5,
      code: 10,
      pdf: 10,
      ppt: 10,
      imageGen: 10,
    };
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const reqCredits = COST[agent] || 1;

    if (user.credits < reqCredits) {
      return res.status(400).json({ message: "not enough credits" });
    }

    user.credits -= reqCredits;
    await user.save();

    const sessionId = req.cookies?.session;
    const session = sessionId
      ? await redis.get(`session:${sessionId}`)
      : null;

    if (sessionId && session) {
      const parsed = JSON.parse(session);
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          ...parsed,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
          planExpiredAt: user.planExpiredAt,
        }),
        "EX",
        7 * 24 * 60 * 60,
      );
    }

    return res
      .status(200)
      .json({
        message: "User payment updated successfully",
        credits: user.credits,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `burn credits failed: ${error.message}` });
  }
};
