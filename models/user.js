var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  referralList: {
    type: Array,
    default: []
  }
});

userSchema.pre("save", async function (next){
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
})


var User = (module.exports = mongoose.model("user", userSchema));


module.exports.getUserByUsername = function (username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, password, callback) {
  bcrypt.compare(candidatePassword, password, function (err, passwordFound) {
    if (err) return callback(err, null);
    callback(null, passwordFound);
  });
};