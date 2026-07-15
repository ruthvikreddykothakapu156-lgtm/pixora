const checkPhotographerOwnership = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  if (req.params.id !== req.user.photographerProfile) {
    return res.status(403).json({ success: false, message: "You can only edit your own profile" });
  }

  next();
};

module.exports = checkPhotographerOwnership;