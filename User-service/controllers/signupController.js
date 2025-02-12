const { createUser, hashData } = require("../../helpers/helper");
const { ACCOUNT_CREATED_MESSAGE } = require("../../constants/constants");
const { LOGIN_PATH } = require("../../constants/paths");

exports.Signup = async (req, res) => {
  const { email, password } = req.body;
  const hashpassword = await hashData(password, 10);
  try {
    const result = await createUser(email, hashpassword);
    if (result) {
      res.status(201).json({
        message: ACCOUNT_CREATED_MESSAGE,
        path: LOGIN_PATH,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
