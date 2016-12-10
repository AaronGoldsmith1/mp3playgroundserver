var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  length: {type: Number, required: true}
})

var playlistSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  songs: [songSchema]
})

var userSchema = new mongoose.Schema({
 name: {type: String, required: true },
 email: {type: String, required: true},
 googleId: {type: String, required: true},
 twitterId: {type: String, required: true},
 playlists: [playlistSchema]
})

var User = mongoose.model('User', userSchema);

module.exports = User;
