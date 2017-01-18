var User        = require('../models/User');
var _           = require('lodash');
var mongoose    = require('mongoose');
var Song        = require('../models/Song');
var aws         = require('aws-sdk');
var mm          = require('musicmetadata');
var fs          = require('fs');
var S3_BUCKET   = "mp3playground";
var s3          = new aws.S3();



module.exports = {
  index:   index,
  signS3:  signS3,
  create:  create,
  show:    show,
  update:  update,
  destroy: destroy
}

//return all songs in the database
function index (req, res, next) {
  Song.find({}, function(err, songs){
    if (err) return console.log(err)
    res.json(songs)
  })
}

function signS3(req, res, next){

  var fileName = req.query['file-name']
  var fileType = req.query['file-type']

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.json(returnData);
  });
}

function create(req, res, next) {

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: req.body.s3_key};

  var s3Stream = s3.getObject(s3Params).createReadStream()
  var parser = mm(s3Stream, {duration: true}, function (err, metadata) {
    if (err) return console.log(err);

    var song = {
      artist: req.body.artist || metadata.artist.join(', '),
      title: req.body.title || metadata.title,
      uploader: req.decoded._id,
      url: req.body.url,
      s3_key: req.body.s3_key,
      duration: metadata.duration
    };
      console.log(metadata);

    Song.create(song, function(err, song) {
      if (err) return console.log(err)
      res.json(song)
    })
  });
}

function show(req, res, next){
  Song.findById(req.params.id, function(err, song){
    if (err) return console.log(err)
    if (!song) {
      res.sendStatus(404)
    } else {
    res.json(song)
    }
  })
};

// function update(req, res, next){
//   Song.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, safe: true },
//     function(err, song){
//     if (err) return console.log(err)
//     res.json(song)
//   })
// };

//make sure authenticatedUser is uploader
function destroy(req, res, next){
  Song.findById(req.params.id, function(err, song){
    if (err) return console.log(err)
      if (songs.uploader != req.decoded._id) {
          return res.status(401).json({message: "not authorized!"})

      }

      var s3Params = {
      Bucket: "mp3playground",
      Key: song.s3_key
    }
    s3.deleteObject(s3Params, function(err, data){
      if (err) return console.log(err)
      song.remove(function(err, song){
        if (err) return console.log(err);
        console.log("deleted Song")
        console.log(song)
        res.sendStatus(204)
      })
    });
  })
}
