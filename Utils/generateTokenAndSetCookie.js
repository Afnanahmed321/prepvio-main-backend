import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, cookieName = "token") => {
  const token = jwt.sign(
    { id: userId }, // ✅ MUST be `id`
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  // ✅ Cookie configuration optimized for OAuth redirects
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // "none" required for cross-site OAuth in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Ensure cookie is available across all paths
  };

  res.cookie(cookieName, token, cookieOptions);

  console.log(`✅ Cookie set: ${cookieName}, secure: ${cookieOptions.secure}, sameSite: ${cookieOptions.sameSite}`);

  return token;
};

// import jwt from "jsonwebtoken";

// export const generateTokenAndSetCookie = (res, userId, cookieName = "token") => {
//   const token = jwt.sign(
//     { id: userId }, // ✅ MUST be `id`
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.cookie(cookieName, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   return token;
// };
