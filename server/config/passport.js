const FacebookStrategy = require('passport-facebook').Strategy;

const authConfig = require('./auth')

module.exports = function(passport) {
   passport.use(new FacebookStrategy({
      clientID :     authConfig.facebookAuth.clientID,
      clientSecret : authConfig.facebookAuth.clientSecret,
      callbackURL :  authConfig.facebookAuth.callbackURL,
      profileFields: authConfig.facebookAuth.profileFields

   },
   // facebook will send back the token and profile
   function(token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {
         console.log("-> token :", token);
         console.log("-> refreshToken :", refreshToken);
         console.log("-> profile :", profile);
         console.log("-----------------------------");

         console.log("profile.photos :", profile.photos);
         console.log("profile.albums :", profile.albums);
      });

   }));

}
