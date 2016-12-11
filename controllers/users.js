var User = require('../models/User');


module.exports = {
  authenticate: authenticate
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
    }
  })
}
