const { Schema, model } = require("mongoose");

const user = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fillustration%2Fdefault-user.html&psig=AOvVaw3kTGDEoujgM495GexnT56i&ust=1722575620811000&source=images&opi=89978449",
  },
});

module.exports = model("users", user);
