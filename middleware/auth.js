const jwt = require("jsonwebtoken");
// const config = require("config");e
require("dotenv").config();

module.exports = function (req, res, next) {
  // Get a token from a header
  // const {token } = req.header('x-auth-token'); //old method deprecated
  // const token = req.headers['x-auth-token'];//new method and should be used
  const token = req.header("x-auth-token");

  // Check if token doesnt exists

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Unauthorized request , no token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    //payload is put in decoded if success
    req.user = decoded.user;
    next(); //Next function is used to pass control to the next middleware function in the request-response
    // cycle.
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
