export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  console.log(token);

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION", // ✅ true in Railway
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax", // ✅ needed for Vercel + Railway
    path: "/", // ✅ ensures the cookie is sent on all routes
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
