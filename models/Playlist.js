var mongoose = require('mongoose')
var Schema = mongoose.Schema

var playlistSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: false}],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

playlistSchema.set("toJSON", {
  transform: function(doc, ret, options){
    console.log(options)
    delete ret.songs
    return ret
  }
})

var Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist;
