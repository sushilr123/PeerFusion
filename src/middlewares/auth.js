const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Please Login!" });
    }

    const decodedObj = await jwt.verify(
      token,
      process.env.JWT_SECRET || "PEER@Fusion$790"
    );

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[AUTH MIDDLEWARE ERROR]:", err.message);
    res.status(401).json({ error: "Authentication failed: " + err.message });
  }
};

module.exports = {
  userAuth,
};
