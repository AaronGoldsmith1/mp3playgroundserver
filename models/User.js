var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  length: {type: Number, required: true},
  url: {type: String, required: false}
})

var playlistSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: false}]
})

var userSchema = new mongoose.Schema({
 name: {type: String, required: true },
 email: {type: String, required: true},
 googleId: {type: String, required: false},
 twitterId: {type: String, required: false},
 songs:[songSchema],
 playlists: [playlistSchema]
})

var User = mongoose.model('User', userSchema);

module.exports = User;
