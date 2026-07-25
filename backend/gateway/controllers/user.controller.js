export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(401)
      .json({ message: `current user not found: ${error.message}` });
  }
};
