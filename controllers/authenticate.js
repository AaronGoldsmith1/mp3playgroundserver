var User = require('../models/User');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

module.exports = {
  login: login,
  logout: logout,
  authenticate: authenticate
}

function login(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  User.findOne({email: email}, function(err, user){
    if (err) return console.log(err)
    if (!user) return res.json({success: false, message: "email and/or passowrd incorrect!"})

    var verified = user.verifyPasswordSync(password)

    if(!verified) return res.json({success: false, message: "email and/or passowrd incorrect!"});


    var token = jwt.sign(_.pick(user, ["_id", "email", "name"]), process.env.TOKEN_SECRET, {expiresIn: 60 * 5})

    res.json({success: true, message: "Successfully authenticated user", token: token})

  })
}

function logout(req, res, next) {

}

function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({success: false, message:"Authorization: Bearer [token]"})
  }

  var authParts = req.headers.authorization.split(" ");
  var token;

  if (authParts.length == 2) {
    var scheme = authParts[0];
    var credentials = authParts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    }

  }else{
    return res.status(401).json({success: false, message:"Authorization: Bearer [token]"})
  }

  console.log(token);
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, user){
    if (err) return res.json({success: false, message: err})
    req.authenticatedUser = user
    next();
  })

}
