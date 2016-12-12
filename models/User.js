var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Schema = mongoose.Schema

var userSchema = new mongoose.Schema({
 name: {type: String, required: true },
 email: {type: String, required: true},
 googleId: {type: String, required: false},
 twitterId: {type: String, required: false},
 playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}]
})

// add bcrypt hashing to model (works on a password field)!
userSchema.plugin(require('mongoose-bcrypt'));

userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model('User', userSchema);

User.methods.encrypt = function(password) {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
 };

module.exports = User;
