var User = require('../models/User');
var _ = require('lodash');
var mongoose = require('mongoose');
var Song = require('../models/Song');
var AWS      = require('aws-sdk'),
var s3       = require('s3');
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: BUCKET_ID,
    secretAccessKey: BUCKET_KEY
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}

function index (req, res, next) {
  Song.find({}, function(err, songs){
    if (err) return console.log(err)
    res.json(songs)
  })
}

function create(req, res, next) {
  var song = {artist: req.body.artist, title: req.body.title, uploader: req.authenticatedUser._id, length: 1000}

  Song.create(song, function(err, song) {
      if (err) return console.log(err)
      res.json(song)
  })

  var params = {
    localFile = req.body.localAddress,
    s3Params: {
      Bucket: "mp3playground",
      Key: req.body.title
    }
  }

  var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
      });
    uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
      });
    uploader.on('end', function() {
    console.log("done uploading");
    });

    // req.authenticatedUser._id,
    // { $push : {'songs': song}},
    // { safe: true, new: true },
    // function(err, user){
    //   if (err) return console.log(err)
    //
    //   var newSong = _.find(user.songs, song);
    //
    //   res.json(newSong);
    // });
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

//   console.log("Songs::show", req.params.id)
//   var song = _.find(req.authenticatedUser.songs,
//
//   function(o){
//     return o._id == req.params.id
//   });
//   if (song){
//   res.json(song);
//       } else{
//   res.sendStatus(404)
// }
};

function update(req, res, next){
  Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true, safe: true },
    function(err, song){
    if (err) return console.log(err)
    res.json(song)
  })




  // User.findOneAndUpdate(
  //   { "songs._id": req.params.id, "_id": req.authenticatedUser._id} ,
  //   { "$set": {
  //       "songs.$.title": req.body.title,
  //       "songs.$.artist": req.body.artist
  //   }},{ safe: true, new: true },
  //   function(err, user){
  //     if (err) return console.log(err)
  //     var song = _.find(user.songs, function(o){
  //       return o._id == req.params.id
  //     })
  //     res.json(song)
  //   }
  // );
};

//make sure authenticatedUser is uploader
function destroy(req, res, next){
  Song.findByIdAndRemove(req.params.id, function(err){
    if (err) return console.log(err)
    res.sendStatus(204)
  })

  var params = {
    localFile = req.params.localAddress,
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

    // var song = {artist: req.params.artist, title: req.params.title, length: 1000};
    // if (mongoose.Types.ObjectId.isValid(req.params.id)){
    //   User.findOneAndUpdate(
    //     { "_id": req.authenticatedUser._id} ,
    //     { "$pull": {
    //         "songs":  { '_id' : req.params.id}
    //     }},{ safe: true },
    //     function(err, user) {
    //     if (err) return console.log(err)
    //     res.sendStatus(204)
    //   })
    // }else{
    //     res.sendStatus(204)
    // }
}
