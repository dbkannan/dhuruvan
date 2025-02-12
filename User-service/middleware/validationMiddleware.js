const { checkUserExists } = require("../helpers/helper");
const { USER_NOT_FOUND_MESSAGE } = require("../constants/constants");
const { SIGNUP_PATH } = require("../constants/paths");

const { check, validationResult } = require("express-validator");

const validateLoginEmail = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .custom(async (value) => {
      const [localPart, domainPart] = value.split("@");
      if (!/^[a-zA-Z0-9]+$/.test(localPart)) {
        throw new Error("Email subject must contain only letters and numbers");
      }

      if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainPart)) {
        throw new Error("Invalid domain");
      }

      return true;
    }),
  check("password").notEmpty().withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    const log = errors.array().map((data) => {
      if (!checkUserExists(data.value)) {
        data.path = SIGNUP_PATH;
        return { message: data.msg, path: data.path };
      }
      return { message: data.msg };
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ ...log[0] });
    }
    next();
  },
];

module.exports = validateLoginEmail;
