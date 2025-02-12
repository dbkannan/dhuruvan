const {
  checkUserExists,
  generateOTP,
  messageRoute,
  deleteAccount,
  sendOTP,
  verifyToken,
  getToken,
} = require("../../helpers/helper");

const { SIGNUP_SECRET_MESSAGE } = require("../../env");
const { INVALID_OTP_MESSAGE } = require("../../constants/constants");

exports.SendOTP = async (req, res) => {
  try {
    let OTP = generateOTP();
    const { email, message } = req.body;
    let { userExistsMessage, path, subject, htmlMessage, Message } =
      messageRoute(message, OTP);
    if (!message || !subject || !htmlMessage) {
      return res.status(403).json({
        message: Message,
      });
    } else if (
      (await checkUserExists(email)) &&
      message === SIGNUP_SECRET_MESSAGE
    ) {
      res.status(400).json({
        message: userExistsMessage,
        path,
      });
    } else {
      const result = await sendOTP(email, OTP, subject, htmlMessage);
      req.session.otp = result;
      res.status(200).json({ result });
    }
  } catch (error) {
    console.log({ sendOTPError: error });
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const otpToken = verifyToken((await getToken(email)).otp).OTP;
  console.log(otpToken === otp);
  if (otpToken === otp) {
    next();
    req.session.destroy();
  } else {
    res.status(400).json({ message: INVALID_OTP_MESSAGE });
  }
};
