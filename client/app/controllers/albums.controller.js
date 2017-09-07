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

      // Splits into rows of 2 (one albums array per row)
      function getRows(albumsArray) {
         let nextIndex = 0;
         let tempArray = [];
         let result = [];
         albumsArray.sort(function(a, b) {
            return a.name > b.name;
         })
         .forEach(function(album, index) {
            console.log("-> index :", index);
            console.log("-> nextIndex :", nextIndex);
            if (index !== nextIndex) return;

            // if album has no photos : hide it
            if (!album.photos) {
               console.log("Index with no photos :", index);
               nextIndex = index + 1;
               return;
            }
            // if album has photos
            else{
               if (albumsArray[index + 1] && albumsArray[index + 1].photos) {
                  tempArray = albumsArray.slice(index, index + 2) // 2 items per row 
                  console.log("tempArray :", tempArray);
                  nextIndex = index + 2;
                  result.push(tempArray);
               }
               // if next album has no photos, slice with the following one
               else{
                  tempArray = albumsArray.slice(index, index + 3)
                  tempArray.splice(1, 1); // remove the middle one
                  console.log("tempArray :", tempArray);
                  nextIndex = index + 3;
                  result.push(tempArray);
               }
            }

         })
         return result;
      }


      window.scp = $scope;
   })

