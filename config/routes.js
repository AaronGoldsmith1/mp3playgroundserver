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
      .post(token.authenticate, songsController.create)

songsRouter.route('/:id')
      .get(songsController.show)
      .put(token.authenticate, songsController.update)
      .delete(token.authenticate, songsController.destroy) //have to be logged w/ token to delete

playlistsRouter.route('/')
      .get(token.authenticate, playlistController.index)
      .post(token.authenticate, playlistController.create)

playlistsRouter.route('/:id')
      .get(playlistController.show)
      .put(token.authenticate, playlistController.update)
      .delete(token.authenticate, playlistController.destroy)

playlistsRouter.route('/:id/songs')
      .post(token.authenticate, playlistController.addSong)

playlistsRouter.route('/:id/songs/:songId')
      .delete(token.authenticate, playlistController.removeSong)

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
