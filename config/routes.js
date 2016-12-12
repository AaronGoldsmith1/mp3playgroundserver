var express            = require('express');
var router             = express.Router();
var songsRouter        = express.Router();
var playlistsRouter    = express.Router();
var userRouter         = express.Router();
var usersController    = require('../controllers/users');
var songsController    = require('../controllers/songs');
var playlistController = require('../controllers/playlists');


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

userRouter.route('/signup')
      .get(usersController.getSignup)
      .post(usersController.postSignup)

userRouter.route('/login')
      .get(usersController.getLogin)
      .post(usersController.postLogin)

userRouter.route('/logout')
      .get(usersController.getLogout)






  // GET /users/:id/playlists






module.exports = {
  songs : songsRouter,
  playlists: playlistsRouter,
  users: usersRouter,
  other: router
};
