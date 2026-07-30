import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";

import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses GitHub login.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "No code provided" });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ success: false, message: "Failed to get access token" });
    }

    // Get user profile from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const githubUser = userResponse.data;

    if (!githubUser || !githubUser.id) {
      return res.status(400).json({ success: false, message: "Failed to fetch GitHub profile" });
    }

    // Get emails
    const emailsResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const primaryEmail = emailsResponse.data.find((e: any) => e.primary && e.verified)?.email || emailsResponse.data[0]?.email;

    if (!primaryEmail) {
      return res.status(400).json({ success: false, message: "No verified email found on GitHub account" });
    }

    // Find or create user
    let user: any = await User.findOne({ githubId: githubUser.id.toString() });

    if (!user) {
      user = await User.findOne({ email: primaryEmail });
      
      if (user) {
        user.githubId = githubUser.id.toString();
        user.githubAccessToken = access_token;
        await user.save();
      } else {
        user = await User.create({
          name: githubUser.name || githubUser.login,
          email: primaryEmail,
          githubId: githubUser.id.toString(),
          githubAccessToken: access_token,
        });
      }
    } else {
      user.githubAccessToken = access_token;
      await user.save();
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "GitHub login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    res.status(500).json({ success: false, message: "Server Error during GitHub authentication." });
  }
};