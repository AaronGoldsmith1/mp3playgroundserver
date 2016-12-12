var express = require('express');
var router             = express.Router();
var songsRouter        = express.Router();
var playlistsRouter    = express.Router();
var usersController    = require('../controllers/users')
var songsController    = require('../controllers/songs')
var playlistController = require('../controllers/playlists')


/* GET home page. */
// API Documentation Landing Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MP3 Playground' });
});

// API Routes, respond with JSON only
songsRouter.route('/')
      .get(songsController.index)
      .post(songsController.create)

songsRouter.route('/:id')
      .get(songsController.show)
      .put(songsController.update)
      .delete(songsController.destroy)

playlistsRouter.route('/')
      .get(playlistController.index)
      .post(playlistController.create)

playlistsRouter.route('/:id')
      .get(playlistController.show)
      .put(playlistController.update)
      .delete(playlistController.destroy)


  // GET /songs
  // POST /songs
  // PUT /songs/:id -> only by uploader
  // DELETE /songs/:id -> only by uploader

  // GET /playlists -> /playlists?user=290148729857 => /playlsits?title=AwesomeList
  // POST /playlists
  // GET /playlsits/:id
  // PUT /playlists/:id
  // DELETE /playlists/:id

  // POST /playlists/:id/songs
  // DELETE /playlist/:id/songs/:songId




// router.route('/api/playlists')

module.exports = {
  songs : songsRouter,
  playlists: playlistsRouter,
  other: router
};
