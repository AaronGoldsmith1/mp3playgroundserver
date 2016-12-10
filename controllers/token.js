// var jwt     = require('jsonwebtoken'),
//     moment  = require('moment'),
//     colors  = require('colors');
//
// var User = require('../models/User');
//
// module.exports = {
//   create: create,
//   token: {
//     checkCredentials:    checkCredentials,
//     checkUserExists:     checkUserExists,
//     validateCredentials: validateCredentials
//   }
// };
//
// function create(req, res, next) {
//   console.log('  Creating token!'.yellow);
//
//   var token = jwt.sign(
//     {
//       email: req.user.email,
//       name:  req.user.name,
//       use:   'public_api'
//     },
//     process.env.SECRET_KEY,
//     {
//       expiresIn: 90 // short, so we can test better
//     }
//   );
//
//   res.json({
//     success:    true,
//     message:    'Successfully generated token',
//     token:      token,
//     seeDecoded: 'http://jwt.io/?value=' + token
//   });
// }
//
// // **************************** VALIDATIONS ****************************
//
// function checkCredentials(req, res, next) {
//   console.log('  Begin validating token creation:'.yellow);
//
//   if (
//     !req.body.email    ||
//     !req.body.password
//   ) {
//     next({
//       status:  422,
//       message: 'Missing required field: email and/or password'
//     });
//   } else {
//     console.log("  All fields present…".green);
//     next();
//   }
// }
//
// function checkUserExists(req, res, next) {
//   User
//     .findOne({email: req.body.email}).exec()
//     .catch(function(err) {
//       next(err);
//     }).then(function(user) {
//       if (!user) {
//         next({
//           status:  401,
//           message: 'Authentication failed: user does not exist'
//         });
//       } else {
//         console.log(
//           "  User found and added to req:".green,
//           user.email + ",",
//           user.name
//         );
//         // add user to request!
//         req.user = user;
//         next();
//       }
//     });
// }
//
// function validateCredentials(req, res, next) {
//   req.user.verifyPassword(req.body.password, function(err, valid) {
//     if (!valid) {
//       next({
//         status:  401,
//         message: 'Authentication failed: credentials incorrect'
//       });
//     } else {
//       console.log("  Password verified:".green, req.body.password);
//       next();
//     }
//   });
// }
