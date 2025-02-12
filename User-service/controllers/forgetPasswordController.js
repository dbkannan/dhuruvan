const {
  checkUserExists,
  isPasswordValid,
  updatePassword,
  hashData,
} = require("../../helpers/helper");

const { USER_NOT_FOUND_MESSAGE } = require("../../constants/constants");
const { SIGNUP_PATH } = require("../../constants/paths");

exports.ForgetPassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = await checkUserExists(email);
  if (!user) {
    return res.status(404).json({
      message: USER_NOT_FOUND_MESSAGE,
      path: SIGNUP_PATH,
    });
  } else if (!(await isPasswordValid(currentPassword, user.password))) {
    return res.status(401).json({ message: "Invalid current password" });
  } else if (await isPasswordValid(newPassword, user.password)) {
    return res.status(400).json({
      message: "The new password already exists. Please try a different one.",
    });
  } else {
    const hashpassword = await hashData(newPassword, 10);
    updatePassword(email, hashpassword)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => console.error(e));

    res.status(200).json({
      message: "Password updated successfully!",
    });
  }
};
