var express                = require('express');
var router                 = express.Router();
var songsRouter            = express.Router();
var playlistsRouter        = express.Router();
var usersRouter            = express.Router();
var usersController        = require('../controllers/users');
var songsController        = require('../controllers/songs');
var playlistController     = require('../controllers/playlists');
var token                  = require('./token_auth');

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
      .delete(token.authenticate, songsController.destroy) //have to be logged w/ token to delete

playlistsRouter.route('/')
      .get(playlistController.index)
      .post(playlistController.create)

playlistsRouter.route('/:id')
      .get(playlistController.show)
      .put(playlistController.update)
      .delete(playlistController.destroy)

playlistsRouter.route('/:id/songs')
      .post(playlistController.addSong)

playlistsRouter.route('/:id/songs/:songId')
      .delete(playlistController.removeSong)

usersRouter.route('/')
      .post(usersController.create)

router.route('/api/token') //handles sign in
      .post(token.create)

usersRouter.route('/me')
      .get(token.authenticate, usersController.me)

router.get('/sign-s3', songsController.signS3)

module.exports = {
  songs:        songsRouter,
  playlists:    playlistsRouter,
  users:        usersRouter,
  other:        router
};
