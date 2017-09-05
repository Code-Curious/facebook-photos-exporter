const FacebookStrategy = require('passport-facebook').Strategy;
const util = require('util');
const User = require('../models/user.model');

const authConfig = {
   'facebookAuth': {
      'clientID': '1941794489439260',
      'clientSecret': '9e6d590d7192f5c3457eda492a498210',
      'callbackURL': 'http://localhost:3000/auth/facebook/callback',
      'enableProof': true,
      'profileFields': ['id', 'displayName', 'photos', 'email', 'cover', 'albums']
   }
}


module.exports = function(passport) {
   // define how to serialize/deserialize user :
   passport.serializeUser(function(user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
            done(err, user);
        });
   });

   passport.use(new FacebookStrategy({
      clientID :     authConfig.facebookAuth.clientID,
      clientSecret : authConfig.facebookAuth.clientSecret,
      callbackURL :  authConfig.facebookAuth.callbackURL,
      profileFields: authConfig.facebookAuth.profileFields

   },
   // facebook will send back the token and profile
   function(token, refreshToken, profile, done) {
      console.log("--> token :", token);
      console.log("---------------------------");

      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

         if (err)
            return done(err);

         if (user) {
            console.log("=> new token :", token);
            console.log("=> old token :", user.facebook.token);
            if (user.facebook.token != token) {
               user.facebook.token = token; // update token
               user.save(function(err, updatedUser) {
                  if (err) throw err;
                  console.log("-------  TOKEN UPDATED IN DB -------");
                  return done(null, updatedUser);
               })
            }
            else{
               // user found & no need to update token
               console.log("-------  USER FOUND -------");
               return done(null, user); 
            }
         } else {
            // user not found, create new user 
            var newUser = new User();

            // save facebook data
            newUser.facebook.id    = profile.id; // set the users facebook id                   
            newUser.facebook.token = token; // token used for calling facebook API
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            // save our user to the database
            newUser.save(function(err) {
               if (err)
                  throw err;

               console.log("-------  NEW USER ADDED -------");
               return done(null, newUser);
            });
          }

      });

     
      // done(null, profile);

   }));

}
