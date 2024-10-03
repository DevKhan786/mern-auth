  import express from "express";
  import User from "../models/UserModel.js";
  import bcryptjs from "bcryptjs";
  import jwt from "jsonwebtoken";

  const router = express.Router();

  router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username Required..." });
    if (!email) return res.status(400).json({ message: "Email Required..." });
    if (!password)
      return res.status(400).json({ message: "Password Required..." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid Email..." });

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User Exists..." });

      const existingUsernameUser = await User.findOne({ username });
      if (existingUsernameUser)
        return res.status(400).json({ message: "Username Taken..." });

      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User Created!" });
    } catch (err) {
      console.error("Error during user signup:", err);
      res.status(500).json({ message: "Error", error: err.message });
    }
  });

  router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email Required..." });
    if (!password)
      return res.status(400).json({ message: "Password Required..." });

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return res.status(404).json({ message: "Email not found..." });

      const validPassword = bcryptjs.compareSync(password, existingUser.password);
      if (!validPassword)
        return res.status(401).json({ message: "Invalid Password..." });

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: hashedPassword, ...rest } = existingUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json(rest);
    } catch (err) {
      console.error("Error during user signin:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  router.post("/signout", (req, res) => {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Signed Out..." });
  });

  router.post("/google", async (req, res) => {
    const { email, username } = req.body;

    if (!email) return res.status(400).json({ message: "Email Required..." });

    try {
      let user = await User.findOne({ email });

      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({ ...user._doc, token });
      }

      const usernameExists = await User.findOne({ username });
      if (usernameExists)
        return res.status(400).json({ message: "Username Exists..." });

      user = new User({ username, email });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ ...user._doc, token });
    } catch (error) {
      console.error("Error during Google OAuth:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  export default router;
