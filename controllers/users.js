var User     = require('../models/User');
var passport = require('passport');


function create(req, res, next) {
  console.log("UserController::Create");
  if (!req.body.password) {
    return res.status(422).send('Missing required fields');
  }

  User
    .create(req.body, function(err, user) {
      console.log(err, user);
      if(err) return res.json({success:false, error: err})

      user.verifyPassword(req.body.password, function(err, valid){
        console.log(err, valid);
        if (err) return res.json({success: false, error: err})

        res.json({
          success: true,
          message: 'Successfully created user.',
          data: {
            name:  user.name,
            email: user.email,
            id:    user._id
          }
        });
      })
    });
};

function me(req, res, next) {
  res.json(req.authenticatedUser)
};

module.exports = {
  create: create,
  me: me
}
