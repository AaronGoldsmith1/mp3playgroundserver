var User        = require('../models/User');
var _           = require('lodash');
var mongoose    = require('mongoose');
var Song        = require('../models/Song');
var mp3Duration = require('mp3-duration');
var ID3         = require('id3-parser');
var aws         = require('aws-sdk');

module.exports = {
  index:   index,
  signS3:  signS3,
  create:  create,
  show:    show,
  update:  update,
  destroy: destroy
}

function index (req, res, next) {
  Song.find({}, function(err, songs){
    if (err) return console.log(err)
    res.json(songs)
  })
}

function signS3(req, res, next){
  var s3 = new aws.S3();
  var S3_BUCKET = "mp3playground"
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
  //var mySong = ID3.parse()
  //mysong.artist
  //mysong.title

  var song = {artist: req.body.artist, title: req.body.title, uploader: req.authenticatedUser._id, url: req.body.url, length: 1000}
  Song.create(song, function(err, song) {
      if (err) return console.log(err)
      res.json(song)
  })
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

function update(req, res, next){
  Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true, safe: true },
    function(err, song){
    if (err) return console.log(err)
    res.json(song)
  })
};

//make sure authenticatedUser is uploader
function destroy(req, res, next){
  Song.findByIdAndRemove(req.params.id, function(err){
    if (err) return console.log(err)
    res.sendStatus(204)
  })
  var params = {
    localFile: req.params.localAddress,
    s3Params: {
      Bucket: "mp3playground",
      Key: req.params.title
    }
  }
  var uploader = client.deleteObjects(params);
    uploader.on('error', function(err) {
    console.error("unable to delete:", err.stack);
      });
    uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
      });
    uploader.on('end', function() {
    console.log("done deleting");
    });
}
