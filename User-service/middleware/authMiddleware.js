const { SendOTP, verifyOTP } = require("../controllers/auth/OTPcontroller");

exports.otpMiddleware = (req, res, next) => {
  if (!req.session.otp) {
    SendOTP(req, res, next);
  } else {
    verifyOTP(req, res, next);
  }
};

exports.resetSession = (req, res, next) => {
  if (!req.session.isNew) {
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.status(500).json({ error: "Failed to reset session" });
      }
      next();
    });
  } else {
    next();
  }
};

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookie.token;
  next();
};
