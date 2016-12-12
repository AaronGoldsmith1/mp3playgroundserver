var mongoose = require('mongoose')

var playlistSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  songs: [{type: mongoose.Schema.Type.ObjectId, ref: 'Song', required: false}]
})


var Playlist = module.model('Playlist', playlistSchema)

module.exports = Playlist;
