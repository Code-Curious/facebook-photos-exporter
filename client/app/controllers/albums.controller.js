angular.module('app')
   .controller('AlbumsCtrl', function($http, $scope, ApiSrv) {
      console.log("hello from AlbumsCtrl");
      ApiSrv.getAlbums().then(function(res) {
         console.log("Api results :", res.data);
         $scope.albums = res.data.data;
      })

      window.scp = $scope;
   })

