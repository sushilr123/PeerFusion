const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      console.log("[SIGNUP] User already exists:", emailId);
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const { password: userPassword, ...userProfile } = savedUser.toObject();
    res.json({ message: "User Added successfully!", data: userProfile });
  } catch (err) {
    console.error("[SIGNUP ERROR]:", err.message);
    res.status(400).json({ error: err.message });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    console.log("[LOGIN REQUEST BODY]:", req.body);

    const { emailId, password } = req.body;

    if (!emailId || !password) {
      console.log("[LOGIN] Missing email or password");
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      console.log("[LOGIN] User not found:", emailId);
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    console.log("[LOGIN] User found, validating password");
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      console.log("[LOGIN] Password valid, generating token");
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Remove password before sending and standardize response format
      const { password: userPassword, ...userProfile } = user.toObject();
      console.log("[LOGIN] Sending success response");
      res.json({
        message: "Login successful!",
        data: userProfile,
      });
    } else {
      console.log("[LOGIN] Invalid password for:", emailId);
      res.status(400).json({
        error: "Invalid email or password",
      });
    }
  } catch (err) {
    console.error("[LOGIN ERROR]:", err.message);
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
