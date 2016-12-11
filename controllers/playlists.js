var User = require('../models/User');
var _ = require('lodash');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}

//need function to show all playlists from all users?
//seperate functions to add/remove songs from playlist?


function index (req, res, next) {
  res.json(req.authenticatedUser.playlists);
}

function create(req, res, next) {
  var playlist = {title: req.body.title, description: req.body.description, songs: []}

  User.findByIdAndUpdate(
    req.authenticatedUser._id,
    { $push : {'playlists': playlist}},
    { safe: true, new: true },
    function(err, user){
      if (err) return console.log(err)

      var newPlaylist = _.find(user.playlists, playlist);

      res.json(newPlaylist);
    });
}

function show(req, res, next){
  console.log("Playlists::show", req.params.id)
  var playlist = _.find(req.authenticatedUser.playlists,

  function(o){
    return o._id == req.params.id
  });

  res.json(playlist);
};

function update(req, res, next) {

      //$push, $pull songs? or just change title/description?
}

function destroy(req, res, next){
    var playlist = {title: req.params.title, description: req.params.description, songs: req.params.songs}


    User.update(req.authenticatedUser._id, {$pull : { 'playlists': playlist }}, { safe: true }, function(err, user) {
      if (err) return console.log(err)

      res.json(req.authenticatedUser.playlists)
    })

}
