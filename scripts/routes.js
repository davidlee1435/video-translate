"use strict";

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    // if (req.isAuthenticated()) {
    //   res.redirect('/home');
    // } else {
      res.render('index', {
        title: 'Video-translator'
      });
    // }
  });

  // app.get('/auth/google', passport.authenticate('google', {
  //   scope: ['profile', 'email']
  // }));

  // app.get('/auth/google/callback', passport.authenticate('google', {
  //     successRedirect: '/home',
  //     failureRedirect: '/'
  //   }),
  //   function(req, res) {
  //     res.redirect('/home');
  //   }
  // );
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['user_events']}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect : '/'}),
    function(req, res){
      fbgraph(req.user.info, io);
      res.redirect('/home');
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};