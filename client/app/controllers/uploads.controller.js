angular.module('app')
   .controller('UploadsCtrl', function($http, $scope, ApiSrv) {
      console.log("hello from UploadsCtrl");

      // init materialboxed
      function initLightBox(){
         $(document).ready(function(){
             $('.materialboxed').materialbox();
         });
      }

      ApiSrv.getDownloadedPhotos()
         .then(function(res) {
            console.log("res in getDownloadedPhotos :", res);
            $scope.photos = res.data;
            initLightBox();
            
         })
         .catch(function(err) {
            console.error("error while getting photos :", err);
         })


   })

