angular.module('app')
   .factory('ApiSrv', function($http) {
      return {
         getAlbums: function() {
            return $http.get('/api/albums');
         },
         getPhotos: function(albumId) {
            return $http.get('/api/albums/' + albumId);
         },
         getDownloadedPhotos: function() {
            return $http.get('/api/downloadedPhotos');
         },
         uploadPhotos: function(photosArray) {
            return $http.post('/api/downloadPhotos', photosArray); // download photos to server, call facebook API to get the largest image file
         }
      }
   })
