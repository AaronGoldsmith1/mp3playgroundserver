var User     = require('../models/User');
var Playlist = require('../models/Playlist');
var Song     = require('../models/Song');
var _        = require('lodash');
var mongoose = require('mongoose')


module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy,
  addSong: addSongToPlaylist,
  removeSong: removeSongFromPlaylist
}

//break down into middleware
//All playlists for all users
//TODO: add filtering and searching methods
function index (req, res, next) {
  Playlist.find({}, {songs: 0}, function(err, playlists){
    if (err) return console.log(err)

    res.json(playlists);
  })
}

function create(req, res, next) {
  var playlistData = { title: req.body.title, description: req.body.description, owner: req.authenticatedUser._id}

  Playlist.create(playlistData, function(err, playlist){
    if (err) return console.log(err)
    res.json(playlist)
  })
}

function show(req, res, next){
  Playlist.findById(req.params.id)
          .populate("songs")
          .exec(function(err, playlist){
            if (err) return console.log(err)
            if (!playlist){
              res.sendStatus(404)
            } else {
              res.json(playlist)
            }
          })
        };


function update(req, res, next) {
  Playlist.findById(req.params.id,
  function(err, playlist){
    if (err) return console.log(err)

    console.log(playlist.owner + "!=" + req.authenticatedUser._id)
    console.log(playlist.owner != req.authenticatedUser._id)
    if (playlist.owner.toString() != req.authenticatedUser._id){
      return res.status(401).json({error: "Unauthorized!"})
    }

    playlist.title = req.body.title;
    playlist.description = req.body.description;
    playlist.save({new: true, safe: true}, function(err, playlist){
      if (err) return console.log(err)
      res.json(playlist)
    })
  })
}

function addSongToPlaylist(req, res, next){
    Playlist.findById(req.params.id, function(err, playlist){
      if (err) return console.log(err)
      if (!playlist) {
        return res.sendStatus(404)
      }

      if (playlist.owner.toString() != req.authenticatedUser._id){
        return res.status(401).json({error: "Unauthorized!"})
      }

      if(!mongoose.Types.ObjectId.isValid(req.body.songId)){
        return res.status(422).json({error: "Invalid Id"})
      }

      var mongoId = new mongoose.Types.ObjectId(req.body.songId);

      Song.count({ _id: mongoId }, function(err, count){
        if (err) return console.log(err)
        if (count == 0) {
          return res.send(422).json({error: "Song not found!"})
        }
        playlist.songs.push(req.body.songId)
        playlist.save(function(err, playlist){
          if (err) return console.log(err)
          res.json(playlist)
        })
      })

    })

}

function removeSongFromPlaylist(req, res, next){
  Playlist.findById(req.params.id, function(err, playlist){
    if (err) return console.log(err)
    if (!playlist) {
      return res.sendStatus(404)
    }
    if (playlist.owner.toString() != req.authenticatedUser._id){
      return res.status(401).json({error: "Unauthorized!"})
    }

    playlist.songs = _.remove(playlist.songs, req.params.songId);

    playlist.save({new: true, safe: true}, function(err, playlist){
      if (err) return console.log(err)
      res.json(playlist)
    })
  })
}


function destroy(req, res, next){
  Playlist.findById(req.params.id, function(err, playlist){
    if (err) return console.log(err)
    if (playlist.owner.toString() != req.authenticatedUser._id){
      return res.status(401).json({error: "Unauthorized!"})
    }
    playlist.remove(function(err){
      if (err) return console.log(err)
      res.sendStatus(204)
    })
  })
}
