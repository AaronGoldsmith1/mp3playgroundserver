var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users')


/* GET home page. */
// API Documentation Landing Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MP3 Playground' });
});

// API Routes, respond with JSON only
router.route('/api/')




module.exports = router;
