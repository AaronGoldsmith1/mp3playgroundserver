var User = require('../models/User');
var _ = require('lodash');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}
// 584ca16013b298f65bc184b6

function index (req, res, next) {
  res.json(req.authenticatedUser.songs);
}

function create(req, res, next) {
  var song = {artist: req.body.artist, title: req.body.title, length: 1000}

  User.findByIdAndUpdate(
    req.authenticatedUser._id,
    { $push : {'songs': song}},
    { safe: true, new: true },
    function(err, user){
      if (err) return console.log(err)

      var newSong = _.find(user.songs, song);

      res.json(newSong);
    });
}

function show(req, res, next){
  console.log("Songs::show", req.params.id)
  var song = _.find(req.authenticatedUser.songs,

  function(o){
    return o._id == req.params.id
  });

  res.json(song);
}

function update(req, res, next){

}

function destroy(req, res, next){

}
