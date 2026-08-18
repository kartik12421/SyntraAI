export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      plan: req.user.plan,
      credits: req.user.credits,
      totalCredits: req.user.totalCredits,
      planExpiredAt: req.user.planExpiredAt,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: `current user not found: ${error.message}` });
  }
};
