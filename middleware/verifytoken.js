// import jwt from "jsonwebtoken";
// import { User } from "../Models/User.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token;

//     // 1️⃣ CHECK HEADER FIRST (Priority for Admin/API calls)
//     if (req.headers.authorization?.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // 2️⃣ STRICT PORT-BINDING FOR COOKIES
//     const origin = req.headers.origin || req.headers.referer || "";
//     const isAdminApp = origin.includes(":5174");
//     const isUserApp = origin.includes(":5173");

//     if (!token) {
//       if (isAdminApp) {
//         // Port 5174: Prioritize admin_token
//         token = req.cookies?.admin_token;
//       } else if (isUserApp) {
//         // Port 5173: Prioritize user_token
//         token = req.cookies?.user_token;
//       } else {
//         // Generic fallback: Try both but be explicit
//         token = req.cookies?.user_token || req.cookies?.admin_token || req.cookies?.token;
//       }
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - no token provided",
//       });
//     }

//     const secret = process.env.JWT_SECRET || "mydevsecret";
//     console.log("DEBUG: Main verifyToken - Using secret:", secret === "mydevsecret" ? "FALLBACK" : "ENV");
//     const decoded = jwt.verify(token, secret);

//     const userId = decoded.id || decoded.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - invalid token",
//       });
//     }

//     // ✅ ADMIN BYPASS: If it's the admin user, skip database lookup
//     if ((userId === "admin" || userId === "admin-fallback") && (decoded.isAdmin || decoded.role === 'admin')) {
//       req.userId = "admin";
//       req.isAdmin = true;
//       return next();
//     }

//     const user = await User.findById(decoded.id).select("_id");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - user not found",
//       });
//     }

//     req.userId = user._id; // ✅ Set req.userId for consistency
//     next();
//   } catch (error) {
//     console.error("verifyToken error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// import jwt from "jsonwebtoken";
// import { User } from "../Models/User.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token;

//     // 1️⃣ CHECK HEADER FIRST (Priority for Admin/API calls)
//     if (req.headers.authorization?.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // 2️⃣ STRICT PORT-BINDING FOR COOKIES
//     const origin = req.headers.origin || req.headers.referer || "";
//     const isAdminApp = origin.includes(":5174");
//     const isUserApp = origin.includes(":5173") || origin.includes("https://prepvio-main-frontend.vercel.app");

//     if (!token) {
//       if (isAdminApp) {
//         // Port 5174: Prioritize admin_token
//         token = req.cookies?.admin_token;
//       } else if (isUserApp) {
//         // Port 5173: Prioritize user_token
//         token = req.cookies?.user_token;
//       } else {
//         // Generic fallback: Try both but be explicit
//         token = req.cookies?.user_token || req.cookies?.admin_token || req.cookies?.token;
//       }
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - no token provided",
//       });
//     }

//     const secret = process.env.JWT_SECRET || "mydevsecret";
//     console.log("DEBUG: Main verifyToken - Using secret:", secret === "mydevsecret" ? "FALLBACK" : "ENV");
//     const decoded = jwt.verify(token, secret);

//     const userId = decoded.id || decoded.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - invalid token",
//       });
//     }

//     // ✅ ADMIN BYPASS: If it's the admin user, skip database lookup
//     if ((userId === "admin" || userId === "admin-fallback") && (decoded.isAdmin || decoded.role === 'admin')) {
//       req.userId = "admin";
//       req.isAdmin = true;
//       return next();
//     }

//     const user = await User.findById(userId).select("_id");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - user not found",
//       });
//     }

//     req.userId = user._id; // ✅ Set req.userId for consistency
//     next();
//   } catch (error) {
//     console.error("verifyToken error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ CHECK HEADER FIRST (Priority for Admin/API calls)
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ STRICT PORT-BINDING FOR COOKIES
    const origin = req.headers.origin || req.headers.referer || "";
    const isAdminApp = origin.includes(":5174");
    const isUserApp = origin.includes(":5173") || origin.includes("https://prepvio-main-frontend.vercel.app");

    if (!token) {
      if (isAdminApp) {
        // Port 5174: Prioritize admin_token
        token = req.cookies?.admin_token;
      } else if (isUserApp) {
        // Port 5173: Prioritize user_token
        token = req.cookies?.user_token;
      } else {
        // Generic fallback: Try both but be explicit
        token = req.cookies?.user_token || req.cookies?.admin_token || req.cookies?.token;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    const secret = process.env.JWT_SECRET || "mydevsecret";
    console.log("🔐 JWT_SECRET loaded from ENV:", process.env.JWT_SECRET);
    console.log("🔐 Using secret:", secret);
    console.log("✅ Token verification will use:", secret === "mydevsecret" ? "DEFAULT SECRET (mydevsecret)" : "ENV SECRET");
    // console.log("DEBUG: Main verifyToken - Using secret:", secret === "mydevsecret" ? "FALLBACK" : "ENV");
    const decoded = jwt.verify(token, secret);

    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    // ✅ ADMIN BYPASS: If it's the admin user, skip database lookup
    if ((userId === "admin" || userId === "admin-fallback") && (decoded.isAdmin || decoded.role === 'admin')) {
      req.userId = "admin";
      req.isAdmin = true;
      return next();
    }

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    req.userId = user._id; // ✅ Set req.userId for consistency
    next();
  } catch (error) {
    console.error("verifyToken error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



