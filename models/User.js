var mongoose = require('mongoose');
var Schema = mongoose.Schema

var userSchema = new mongoose.Schema({
 name: {type: String, required: true },
 email: {type: String, required: true},
 googleId: {type: String, required: false},
 twitterId: {type: String, required: false},
 playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}]
})

var User = mongoose.model('User', userSchema);

module.exports = User;
