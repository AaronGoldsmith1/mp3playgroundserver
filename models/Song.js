var mongoose = require('mongoose')
var Schema = mongoose.Schema

var songSchema = new mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  length: {type: Number, required: true},
  url: {type: String, required: false},
  uploader: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

var Song = mongoose.model('Song', songSchema);

module.exports = Song;
