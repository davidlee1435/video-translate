// var User = require('../data_schemas/user');

var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../config');

module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
      clientID: config.fbAuth.appID,
      clientSecret: config.fbAuth.appSecret,
      callbackURL: config.fbAuth.callbackURL
    },

    function(token, refreshToken, profile, done) {
      User.findOne({
        'info.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.info.id = profile.id;
          newUser.info.token = token;
          newUser.info.name = profile._json.first_name + ' ' + profile._json.last_name;
          newUser.info.email = profile._json.email
          console.log(newUser)
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }
  ));
}