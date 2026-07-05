const jwt = require("jsonwebtoken");

const User = require("../models/User");

/*
====================================
PROTECT ROUTES
====================================
*/

const protect = async (
  req,
  res,
  next
) => {
  let token;

  /*
  ====================================
  CHECK AUTH HEADER
  ====================================
  */

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    try {
      /*
      EXTRACT TOKEN
      */

      token =
        req.headers.authorization.split(
          " "
        )[1];

      /*
      VERIFY TOKEN
      */

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      /*
      FIND USER
      */

      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      /*
      USER NOT FOUND
      */

      if (!user) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User not found",
          });
      }

      /*
      ATTACH USER
      */

      req.user = user;

      /*
      IMPORTANT FIX
      */

      req.user.id =
        user._id.toString();

      next();
    } catch (error) {
      console.log(
        "Auth Middleware Error:",
        error
      );

      return res
        .status(401)
        .json({
          success: false,

          message:
            "Unauthorized access",
        });
    }
  }

  /*
  ====================================
  NO TOKEN
  ====================================
  */

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,

        message:
          "No token provided",
      });
  }
};

module.exports = {
  protect,
};