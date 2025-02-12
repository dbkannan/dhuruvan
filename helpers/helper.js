const Product = require("../models/productModel");
const Category = require("../models/productCategories");
const Cart = require("../models/cart");
const User = require("../models/user");
const { hash, compare } = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  find,
  findOne,
  insertMany,
  updateOne,
  deleteOne,
  findById,
  findOneAndUpdate,
  insertOne,
  create,
} = require("./mongooseHelpers");
const {
  SIGNUP_SECRET_MESSAGE,
  LOGIN_OTP_SECRET_MESSAGE,
  SIGNUP_OTP_SECRET_MESSAGE,
  FORGET_PASSWORD_OTP_SECRET_MESSAGE,
  EMAIL,
  PASSWORD,
  SECRET_KEY,
} = require("../env");
const {
  EMAIL_EXISTS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  ACCOUNT_CREATED_MESSAGE,
  PASSWORD_RESET_MESSAGE,
  OTP_SENT_MESSAGE,
} = require("../constants/constants");
const {
  LOGIN_PATH,
  SIGNUP_PATH,
  VERIFY_OTP_PATH,
} = require("../constants/paths");
const { sign, verify } = require("jsonwebtoken");
const Otp = require("../models/OTP");

exports.getAllProducts = async (
  userId,
  filter = {},
  fields = {},
  inCart = false
) => {
  const userCart = await Cart.findOne(
    { userId: { $eq: userId } },
    { Items: 1, _id: 0 }
  ).populate([{ path: "Items.productId" }]);
    if (userCart && userCart.Items) {
      const cart =
        userCart.Items.map((item) => ({
          ...item.productId.toObject(),
          cartValue: item.count,
        })) || [];
      const products = await find(Product, filter, fields);
      const productSet = new Set(products.map((_) => _.name));
      const cartSet = new Set(cart.map((_) => _.name));

      let result = [
        ...cart.filter((data) => productSet.has(data.name)),
        ...products.filter((data) => !cartSet.has(data.name)),
      ];
      if (inCart) {
        return cart.filter((data) => productSet.has(data.name));
      }
      return result;
    
  } else {
    const products = await find(Product, filter, fields);
    return products;
  }
};
exports.addProduct = async (data) => {
  return await insertMany(Product, data);
};

exports.updateProduct = async (filter = {}, data) => {
  return await updateOne(Product, filter, data);
};

exports.deleteProduct = async (filter = {}) => {
  return await deleteOne(Product, filter);
};

exports.addCategory = async (data) => {
  return await insertMany(Category, data);
};

exports.updateCategory = async (filter = {}, data) => {
  return await updateOne(Category, filter, data);
};

exports.deleteCategory = async (filter = {}) => {
  return await deleteOne(Category, filter);
};

exports.viewCategory = async (filter = {}) => {
  return await find(Category, filter);
};

exports.addCart = async (data) => {
  return await insertOne(Cart, data);
};

exports.viewCart = async (filter = {}, fields = {}, populate = "") => {
  return await find(Cart, filter, fields, populate);
};

exports.updateCart = async (filter = {}, data) => {
  return await updateOne(Cart, filter, data);
};

exports.addOrUpdateCart = async (filter = {}, update) => {
  return await findOneAndUpdate(Cart, filter, update, { items: 1 });
};

exports.deleteCart = async (filter = {}) => {
  return await deleteOne(Cart, filter);
};

exports.createUser = async (data) => {
  return await insertMany(User, data);
};

exports.checkUserExists = async (email) => {
  return await findOne(User, { email });
};

exports.createToken = (payload, time) => {
  return sign(payload, SECRET_KEY, { expiresIn: time });
};

exports.getToken = async (email) => {
  return await findOne(Otp, { email }, { otp: 1, _id: 0 });
};

exports.verifyToken = (token) => {
  return verify(token, SECRET_KEY);
};

exports.createUser = async (email, password) => {
  return await insertOne(User, { email, password });
};

exports.deleteAccount = async (email) => {
  return await deleteOne(User, { email });
};

exports.extractNameFromEmail = (email) => {
  return email.split("@")[0].replace(/\./g, " ");
};

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

exports.hashData = async (data, count) => {
  return await hash(data, count);
};

exports.isPasswordValid = async (password, hashpassword) => {
  try {
    const result = await compare(password, hashpassword);
    return result;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

exports.messageRoute = (message, OTP) => {
  let userExistsMessage, path, subject, htmlMessage, Message;

  switch (message) {
    case SIGNUP_SECRET_MESSAGE:
      userExistsMessage = EMAIL_EXISTS_MESSAGE;
      path = LOGIN_PATH;
      subject = "OTP for Account verification";
      htmlMessage = `<p>
          Your OTP for Account verification is: <strong>${OTP}</strong>.
          OTP is valid only for 10 minutes.
        </p>`;

      break;
    case LOGIN_OTP_SECRET_MESSAGE:
      userExistsMessage = USER_NOT_FOUND_MESSAGE;
      path = SIGNUP_PATH;
      subject = "OTP for Login";
      htmlMessage = ` <p>
          Your OTP for Login is: <strong>${OTP}</strong>.
          OTP is valid only for 10 minutes.
        </p>`;
      break;

    case SIGNUP_OTP_SECRET_MESSAGE:
      Message = ACCOUNT_CREATED_MESSAGE;
      path = LOGIN_PATH;
      break;

    case FORGET_PASSWORD_OTP_SECRET_MESSAGE:
      Message = PASSWORD_RESET_MESSAGE;
      path = LOGIN_PATH;
      subject = "OTP for Resetting Password";
      htmlMessage = ` <p>
          Your OTP for Password Reset is: <strong>${OTP}</strong>.
          OTP is valid only for 10 minutes.
        </p>`;
      break;

    default:
      Message = "Something Went wrong";
      break;
  }

  return { userExistsMessage, path, subject, htmlMessage, Message };
};

exports.sendEmail = (mailOptions) => {
  const { user, pass, service, ...rest } = mailOptions;
  return nodemailer
    .createTransport({
      service,
      auth: {
        user,
        pass,
      },
    })
    .sendMail(rest);
};

exports.sendOTP = async (email, OTP, subject, htmlMessage) => {
  try {
    const result = await this.sendEmail({
      user: EMAIL,
      pass: PASSWORD,
      service: "gmail",
      to: email,
      subject,
      html: `<p>Hi ${this.extractNameFromEmail(email)},</p>
  <p>${htmlMessage}</p>
  <p>Best Regards,<br>
  Expense Tracker</p>`,
    });
    if (result) {
      const token = this.createToken({ email, OTP }, "1h");

      const emailExits = await findOne(Otp, { email });
      if (emailExits) {
        await findOneAndUpdate(
          Otp,
          { email, count: { $lt: 3 } },
          { otp: token, $inc: { count: 1 } }
        );
      } else {
        await Otp.create({ email, otp: token });
      }
      // const count = (await findOne(Otp, { email }, { count: 1 })).count;

      return { message: OTP_SENT_MESSAGE, path: VERIFY_OTP_PATH, token };
    }
  } catch (error) {
    console.error({ error });
  }
};

exports.updatePassword = async (email, password) => {
  return await findOneAndUpdate(User, { email }, { password });
};
