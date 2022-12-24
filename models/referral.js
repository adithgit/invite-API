var mongoose = require("mongoose");

var referralSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});



var Referral = (module.exports = mongoose.model("referral", referralSchema));


