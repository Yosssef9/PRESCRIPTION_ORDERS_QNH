const express = require("express");
const verifyPortalJwt = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * Checks whether the portal token is valid
 * and returns the current user from the token.
 */
router.get("/me", verifyPortalJwt, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
