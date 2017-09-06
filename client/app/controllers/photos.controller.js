angular.module('app')
   .controller('PhotosCtrl', function($http, $scope, $routeParams, ApiSrv) {
      console.log("hello from PhotosCtrl");
      let currentAlbum = $routeParams.albumId;
      console.log("$scope.currentAlbum :", $scope.currentAlbum);

      // Get pictures from FB
      ApiSrv.getPhotos(currentAlbum)
      .then(function(res) {
         console.log("res :", res);
         $scope.count = res.data.count;
         $scope.photos = res.data.photos.data;
      })
      .catch(function(err) {
         console.error("error while getting photos :", err);
      })

      window.scp = $scope;
   })

