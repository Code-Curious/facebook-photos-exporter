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
         downloadPhotos: function(photosId) {
            return $http.post('/api/downloadPhotos', photosId); // download photos to server, call facebook API to get the largest image file
         }
      }
   })
