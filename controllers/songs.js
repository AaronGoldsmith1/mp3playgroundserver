var User = require('../models/User');
var _ = require('lodash');
var mongoose = require('mongoose');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}

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
  if (song){
  res.json(song);
      } else{
  res.sendStatus(404)
}
};

function update(req, res, next){
  User.findOneAndUpdate(
    { "songs._id": req.params.id, "_id": req.authenticatedUser._id} ,
    { "$set": {
        "songs.$.title": req.body.title,
        "songs.$.artist": req.body.artist
    }},{ safe: true, new: true },
    function(err, user){
      if (err) return console.log(err)
      var song = _.find(user.songs, function(o){
        return o._id == req.params.id
      })
      res.json(song)
    }
  );
};


function destroy(req, res, next){
    var song = {artist: req.params.artist, title: req.params.title, length: 1000};
    if (mongoose.Types.ObjectId.isValid(req.params.id)){
      User.findOneAndUpdate(
        { "_id": req.authenticatedUser._id} ,
        { "$pull": {
            "songs":  { '_id' : req.params.id}
        }},{ safe: true },
        function(err, user) {
        if (err) return console.log(err)
        res.sendStatus(204)
      })
    }else{
        res.sendStatus(204)
    }
}
