const {
  checkUserExists,
  isPasswordValid,
  deleteAccount,
  createToken,
} = require("../../helpers/helper");

const {
  USER_NOT_FOUND_MESSAGE,
  LOGIN_SUCCESSFUL_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} = require("../../constants/constants");
const { SIGNUP_PATH } = require("../../constants/paths");

exports.LoginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await checkUserExists(email);
    if (!user) {
      return res.status(404).json({
        message: USER_NOT_FOUND_MESSAGE,
        path: SIGNUP_PATH,
      });
    }
    if (!(await isPasswordValid(password, user.password))) {
      return res.status(401).json({ message: INCORRECT_PASSWORD_MESSAGE });
    }
    const token = createToken({ email, userid: user._id }, "1h");
    res.cookie(
      "token",
      token,
      { HttpOnly: true },
      { secure: true },
      { expire: 1000 * 60 }
    );
    res
      .status(200)
      .json({ message: LOGIN_SUCCESSFUL_MESSAGE, path: "/", token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
