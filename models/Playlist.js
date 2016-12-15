var mongoose = require('mongoose')
var Schema = mongoose.Schema

var playlistSchema = new mongoose.Schema({
  title:       {type: String, required: true},
  description: {type: String, required: true},
  songs:       [{type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: false}],
  owner:       {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})


var Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist;
