var User     = require('../models/User');
var passport = require('passport');

// // GET /signup
// function getSignup(request, response) {
//
// }
//
// // POST /signup
// function postSignup(request, response) {
//   var user = new User();
//
//     user.name = req.body.name;
//     user.email = req.body.email;
//
//     user.setPassword(req.body.password);
//
//     user.save(function(err) {
//       var token;
//       token = user.generateJwt();
//       res.status(200);
//       res.json({
//         "token" : token
//       });
//     });
// }
//
// // GET /login
// function getLogin(request, response) {
//
// }
//
// // POST /login
// function postLogin(request, response) {
//
//   passport.authenticate('local', function(err, user, info){
//     var token;
//
//     // If Passport throws/catches an error
//     if (err) {
//       res.status(404).json(err);
//       return;
//     }
//
//     // If a user is found
//     if(user){
//       token = user.generateJwt();
//       res.status(200);
//       res.json({
//         "token" : token
//       });
//     } else {
//       // If user is not found
//       res.status(401).json(info);
//     }
//   })(req, res);
//
// }
//
// // GET /logout
// function getLogout(request, response) {
// }
//
// // Restricted page
// function secret(request, response){
// }

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

function create(req, res, next) {
  if (!req.body.password) {
    return res.status(422).send('Missing required fields');
  }
  User
    .create(req.body)
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully created user.',
        data: {
          email: user.email,
          id:    user._id
        }
      });
    }).catch(function(err) {
      if (err.message.match(/E11000/)) {
        err.status = 409;
      } else {
        err.status = 422;
      }
      next(err);
    });
};

function me(req, res, next) {
  User
    .findOne({email: req.decoded.email}).exec()
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully retrieved user data.',
        data: user
      });
    })
    .catch(function(err) {
      next(err);
    });
};

module.exports = {
  authenticate: authenticate,
  // getLogin: getLogin,
  // postLogin: postLogin ,
  // getSignup: getSignup,
  // postSignup: postSignup,
  // getLogout: getLogout,
  create: create,
  me: me,
  secret: secret
}
