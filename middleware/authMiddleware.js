import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    // 🔥 ONLY READ FROM COOKIES
    const token =
      req.cookies?.user_token ||
      req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    // 🔥 HANDLE HARDCODED ADMIN
    if (userId === "admin") {
      req.user = {
        _id: "admin",
        id: "admin",
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
        isAdmin: true
      };
      req.userId = "admin";
      return next();
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("verifyToken error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const isAdmin = (req, res, next) => {
  const userRole = req.user?.role?.toLowerCase();

  if (userRole === 'admin' || userRole === 'superadmin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access only.'
    });
  }
};

export const authenticate = verifyToken;
