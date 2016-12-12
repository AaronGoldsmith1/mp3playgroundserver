var User     = require('../models/User');
var passport = require('passport');

// GET /signup
function getSignup(request, response) {
}

// POST /signup
function postSignup(request, response) {
}

// GET /login
function getLogin(request, response) {
}

// POST /login
function postLogin(request, response) {
}

// GET /logout
function getLogout(request, response) {
}

// Restricted page
function secret(request, response){
}

function authenticate (req, res, next) {
  // Hack to mock a user
  var userData = {
    name: "aaa",
    email: "aaa@aaa.com",
    twitterId: "myTwitterID",
    googleId: "myGoogleID"
  }
  User.findOne({email: userData.email}, function(err, user){
    if (err || !user) {
      User.create(userData, function(err, user){
        if (err) return console.log(err)

        req.authenticatedUser = user;
        next();
      })
    }else{
      // User exists
      req.authenticatedUser = user;
      next();
    };
  });
};

module.exports = {
  authenticate: authenticate,
  getLogin: getLogin,
  postLogin: postLogin ,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
  secret: secret
}
