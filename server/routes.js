"use strict";

const path = require('path'),
      util = require('util'),
      fs = require('fs'),
      request = require('request-promise'),
      async =  require('async'),
      _ = require('lodash'),
      User = require('./models/user.model');


module.exports = function(app, passport) {

   // =====================================
   // HOME PAGE (with login links) ========
   // =====================================
   app.get('/', function(req, res) {
    console.log("=====> ACCESSING ROOT URL (/) ");
    console.log("req.sessionID :", req.sessionID);
    res.sendFile(path.resolve('client/index.html'));

   });


   // handle the callback after facebook has authenticated the user
   app.get('/auth/facebook/callback',
      // function(req, res, next){
      //   console.log("=====> ACCESSING AUTH/FACEBOOK/CALLBACK");
      //   next();
      // })
      // passport.authenticate('facebook', {
      //    successRedirect : '/albums',
      //    failureRedirect : '/autherror'
         // failureFlash: 'Error while authentificating with Facebook'
      function (req, res, next) {
           var authenticator = passport.authenticate ('facebook', {
             successRedirect: '/albums',
             failureRedirect: '/'
            });

          // delete req.session.returnTo;
          authenticator (req, res, next);
          })
      // } ));

   // FIXED: authorization code already bug used was caused by the ordering of routes definition
   app.use('/auth/facebook', 
    function(req, res, next){
      console.log("=====> ACCESSING AUTH/FACEBOOK");
      next()
    },

    passport.authenticate('facebook', {
      scope: 'email',

   }));

   // =====================================
   // LOGOUT
   // =====================================

   app.get('/auth/logout', function(req, res) {
      console.log("=====> ACCESSING LOGOUT (/LOGOUT)");
      console.log("req.session before logout :", req.session);
      req.session.destroy((err) => {
         if(err) return next(err)
         req.logout()
         // res.sendStatus(200)
         console.log("req.session after logout :", req.session);
         res.redirect('/login');
      })
   });

   // Login Page
   app.get('/login', function(req, res) {
      console.log("=====> ACCESSING LOGIN PAGE (/login)");
      res.sendFile(path.resolve('client/index.html'));
   });

   app.get('/autherror', function(req, res) {
      console.log("=====> ACCESSING /AUTHERROR");
      res.sendStatus(401);
      res.redirect('/login');
   });

   app.get('/favicon.ico', function(req, res) {
      res.sendFile(path.resolve('client/favicon.ico'));
   });

   // font Roboto not present in dist folder
   app.get("/bower_components/*", function(req, res) {
      res.sendFile(path.join('../client/bower_components/', req.url));
   })

   app.get("/app/*", function(req, res) {
      res.sendFile(path.join('../client/app/', req.url));
   })

   //////////////////////////////////////
   // APIS CALLED FROM ANGULAR SERVICE //
   //////////////////////////////////////

   // Get all albums :
   app.get("/api/albums", function(req, res) {
      console.log("=====> CALLING /API/ALBUMS");
      console.log("req.session :", req.session);
      console.log("req.user :", req.user);
      if (!req.user) return res.status(401).send('Unauthorized');

      console.log("req.user.facebook.token :", req.user.facebook.token);

      let options = {
        method: 'GET',
        url: 'https://graph.facebook.com/v2.9/me/albums',
        qs: {
          access_token: req.user.facebook.token,
          fields: 'count,description,link,name,cover_photo,photos{images,name,id,album}'
        },
        json: true // Automatically parses the JSON string in the response
      };
      
      let FbApiRequest = request(options);
      FbApiRequest.then(function(FbResult) {
         return res.json(FbResult);
      })

   })

   // Get albums photos:
   app.get("/api/albums/:albumId", function(req, res) {
      console.log("=====> CALLING /API/ALBUMS");
      console.log("req.session :", req.session);
      console.log("req.user :", req.user);
      if (!req.user) return res.status(401).send('Unauthorized');

      console.log("req.user.facebook.token :", req.user.facebook.token);

      let options = {
        method: 'GET',
        url: 'https://graph.facebook.com/v2.9/' + req.params.albumId,
        qs: {
          access_token: req.user.facebook.token,
          fields: 'count,photos{id,name,images,album}'
        },
        json: true // Automatically parses the JSON string in the response
      };
      
      let FbApiRequest = request(options);
      FbApiRequest.then(function(FbResult) {
         return res.json(FbResult);
      })

   })
   
   // upload photos to server :
   app.post("/api/downloadPhotos", function(req, res) {
      console.log("=====> CALLING /API/DOWNLOADPHOTOS");
      console.log("****************");
      console.log("req.user :", req.user);
      console.log("****************");
      if (!req.user) return res.status(401).send('Unauthorized');

      console.log("req.user.facebook.token :", req.user.facebook.token);
      // console.log("req.body :\n", JSON.stringify(req.body, null, 2));

      async.each(req.body, function(photo, asyncCallback){
         let photoUrl = photo.images[0].source;
         let filePath = "client/img/uploads/" + photo.id + ".jpg";
         saveFile(photoUrl, filePath, function() {
            console.log("--> a file uploaded successfully");
            asyncCallback();

         }, function(streamError) {
            // in case of error during current iteration
            if (streamError) {
               console.log("error while uploading a file");
               console.error("streamError :", streamError);
               asyncCallback(streamError);

            }
         });
      }, function(asyncErr) {
         // in case of error in all
         if (asyncErr) {
            console.log("ASYNCERR :", asyncErr);
            return res.status(500).send(asyncErr);
         }
         else{
            console.log("All files have been uploaded");
            // updateUserWithPhotos()
            // call DB to update user with the new photos
            User.findById(req.user._id)
            // .exec()
            .then(function(user, err) {
               if (err) return console.error(err);
               req.body.forEach(function(photo) {
                  if (_.some(user.photos, (userPhoto) => userPhoto.FBid == photo.id)) {
                     console.log("PHOTO ALREADY EXISTS IN DATABASE");
                  }
                  else{
                     user.photos.push({
                        created: Date.now(),
                        url: "img/uploads/" + photo.id + ".jpg",
                        FBid: photo.id,
                        name: photo.name,
                        description: photo.description,
                        albumId: photo.album.id,
                        albumName: photo.album.name
                     });
                  }
               });


               console.log("user before save() :", JSON.stringify(user, null, 2));
               user.save(function(err) {
                  if (err) return res.status(500).send(err);
                  else{
                     console.log("=> User updated");
                     res.jsonp(user);
                  }
               })
            })
         }
      });
   })

/*   function updateUserWithPhotos(userId, photos) {
      return User.find({_id: userId}).lean().exec()
   }
*/
  /* function savePhotosFiles(argument) {
      // Promise.all([])
        
   }*/

   function saveFile(uri, filename, successCallback, errorCallback) {
      request.head(uri, function(err, res, body) {
         console.log('content-type:', res.headers['content-type']);
         console.log('content-length:', res.headers['content-length']);

         request(uri).pipe(fs.createWriteStream(filename))
            // .on('error', errorCallback);
            .on('close', successCallback);
      });
   }

   // Api for Uploads page :
   app.get("/api/downloadedPhotos", function(req, res) {
      User.findById(req.user._id)
      .then(function(user, err) {
         if (err) return console.error(err);
         return res.send(user.photos);
      })
   })
   


   // all other routes : send index.html (handled client side) + verify authentication
   app.route('*')
   .get(isLoggedIn, (req, res) => {
      console.log("=====> ACCESSING OTHER URL (*) : ", req.originalUrl);
      res.sendFile(path.resolve('client/index.html'));
   });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

   // if user is authenticated in the session, carry on
   if (req.user)
      return next();

   // if they aren't redirect them to the login page
   res.redirect('/login');
}
