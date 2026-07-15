const jwt = require("jsonwebtoken");

const generateToken = (userId, role, photographerProfile = null) => {
  return jwt.sign(
    { id: userId, role: role, photographerProfile: photographerProfile },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;