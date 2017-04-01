var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true, unique: true },
  userPhoto: {type: String}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
