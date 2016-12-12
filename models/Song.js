var mongoose = require('mongoose')

var songSchema = new mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  length: {type: Number, required: true},
  url: {type: String, required: false},
  uploader: {type: mongoose.Schema.Type.ObjectId, ref: 'User', required: true}
})

var Song = mongoose.model('User', userSchema);

module.exports = Song;
