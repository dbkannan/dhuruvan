const FORGET_PASSWORD_PATH = "/forget-password";
const LOGIN_PATH = "/login";
const LOGIN_WITH_OTP_PATH = "/login-with-otp";
const SIGNUP_PATH = "/signup";
const VERIFY_OTP_PATH = "/verify-otp";
const SEND_OTP = "/send-otp";
const HOME = "/";
const GET_ALL_PRODUCTS_PATH = "/products/:category";
const GET_ONE_PRODUCT_PATH = "/product/:id";
const GET_ALL_CATOGORIES = "/category";
const VIEW_CART_PATH = "/getcart/:userId";
const ADD_CART_PATH = "/addcart";
const UPDATE_CART_PATH = "/updatecart";
const DELETE_CART_PATH = "/deletecart";
const SEARCH_PATH = "/search/:searchText";
const ADMIN_ADD_PRODUCT_PATH = "/admin/addproduct";
const ADMIN_UPDATE_PRODUCT_PATH = "/admin/updateproduct/:id";
const ADMIN_DELETE_PRODUCT_PATH = "/admin/deleteproduct/:id";

const ADMIN_ADD_CATEGORY_PATH = "/admin/addcategory";
const ADMIN_UPDATE_CATEGORY_PATH = "/admin/updatecategory/:id";
const ADMIN_DELETE_CATEGORY_PATH = "/admin/deletecategory/:id";

const ADD_WISH_LIST = "/addwishlist";
const GET_WISH_LIST = "/getwishlist/:userId";
const DELETE_WISH_LIST = "/deletewishlist/:userId";
module.exports = {
  HOME,
  ADD_WISH_LIST,
  GET_WISH_LIST,
  SEARCH_PATH,
  DELETE_WISH_LIST,
  FORGET_PASSWORD_PATH,
  LOGIN_PATH,
  LOGIN_WITH_OTP_PATH,
  SIGNUP_PATH,
  VERIFY_OTP_PATH,
  SEND_OTP,
  GET_ALL_PRODUCTS_PATH,
  GET_ONE_PRODUCT_PATH,
  GET_ALL_CATOGORIES,
  VIEW_CART_PATH,
  ADD_CART_PATH,
  UPDATE_CART_PATH,
  DELETE_CART_PATH,
  ADMIN_ADD_PRODUCT_PATH,
  ADMIN_UPDATE_PRODUCT_PATH,
  ADMIN_DELETE_PRODUCT_PATH,
  ADMIN_ADD_CATEGORY_PATH,
  ADMIN_UPDATE_CATEGORY_PATH,
  ADMIN_DELETE_CATEGORY_PATH,
};
