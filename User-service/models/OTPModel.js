// models/otpModel.js
const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
  email: { type: String, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: "1m", default: Date.now },
  count: { type: Number, default: 1, require: true },
});

module.exports = model("OTP", otpSchema);
