const path = require('path');

module.exports = function(app, passport) {

   // =====================================
   // HOME PAGE (with login links) ========
   // =====================================
   app.get('/', function(req, res) {

   });

   
   // =====================================
   // FACEBOOK ROUTES =====================
   // =====================================
   // route for facebook authentication and login
   app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: ['email']
   }));

   // handle the callback after facebook has authenticated the user
   app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
         successRedirect : '/profile',
         failureRedirect : '/',
         failureFlash: 'Error while authentificating with Facebook'
      } ));

   // =====================================
   // LOGOUT ==============================
   // =====================================

   app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
   });

   app.get('/profile', function(req, res) {
       console.log("%c Accessing Profile page", "color: cyan");
       res.sendFile(path.resolve('client/index.html'));
   });

   // all other routes : send index.html 
   app.route('*')
     .get((req, res) => {
       res.sendFile(path.resolve('client/index.html'));
     });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

   // if user is authenticated in the session, carry on
   if (req.isAuthenticated())
      return next();

   // if they aren't redirect them to the home page
   res.redirect('/');
}
