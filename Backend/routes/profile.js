const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User not found");
    }

    // Remove sensitive information before sending
    const { password, ...userProfile } = user.toObject();

    res.json({
      message: "Profile fetched successfully",
      data: userProfile,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("No data provided for update");
    }

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Only update fields that are actually provided and not empty
    Object.keys(req.body).forEach((key) => {
      if (
        req.body[key] !== undefined &&
        req.body[key] !== null &&
        req.body[key] !== ""
      ) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    // Remove sensitive information before sending
    const { password, ...userProfile } = loggedInUser.toObject();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: userProfile,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
