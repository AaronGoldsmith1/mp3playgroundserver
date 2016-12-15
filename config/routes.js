var express                = require('express');
var router                 = express.Router();
var songsRouter            = express.Router();
var playlistsRouter        = express.Router();
var usersRouter            = express.Router();
var authenticateRouter     = express.Router();
var usersController        = require('../controllers/users');
var songsController        = require('../controllers/songs');
var playlistController     = require('../controllers/playlists');
var authenticateController = require ('../controllers/authenticate.js');
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
      .delete(songsController.destroy)

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

router.route('/api/signup')
      .post(usersController.create)

authenticateRouter.route('/')
    .post(authenticateController.login)

authenticateRouter.route('/logout')
      .get(authenticateController.logout)

usersRouter.route('/me')
      .get(usersController.me)

router.get('/sign-s3', songsController.signS3)

module.exports = {
  songs:        songsRouter,
  playlists:    playlistsRouter,
  authenticate: authenticateRouter,
  users:        usersRouter,
  other:        router
};
