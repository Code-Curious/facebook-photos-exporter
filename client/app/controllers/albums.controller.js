angular.module('app')
   .controller('AlbumsCtrl', function($http, $scope, ApiSrv) {
      console.log("hello from AlbumsCtrl");
      $scope.albumRows = [];

      // Get albums from FB
      ApiSrv.getAlbums()
      .then(function(res) {
         console.log("Api results :", res.data);
         $scope.result = res.data.data;
         $scope.albumRows = getRows(res.data.data);
         console.log("$scope.albumRows :", $scope.albumRows);
      })
      .catch(function(err) {
         console.error("error while getting albums :", err);
      })


      function getRows(albumsArray) {
         let nextIndex = 0;
         let tempArray = [];
         let result = [];
         albumsArray.forEach(function(album, index) {
            console.log("-> index :", index);
            console.log("-> nextIndex :", nextIndex);
            if (index !== nextIndex) return;
            tempArray = albumsArray.slice(index, index + 2) // 2 items per 
            nextIndex = index + 2;
            console.log("tempArray :", tempArray);
            result.push(tempArray);
         })
         return result;
      }


      window.scp = $scope;
   })

