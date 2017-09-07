angular.module('app')
   .controller('PhotosCtrl', function($http, $scope, $routeParams, ApiSrv) {
      console.log("hello from PhotosCtrl");

      // init materialboxed
      function initLightBox(){
         $(document).ready(function(){
             $('.materialboxed').materialbox();
         });
      }
      let currentAlbum = $routeParams.albumId;
      console.log("$scope.currentAlbum :", $scope.currentAlbum);

      $scope.currentPage = 1;
      $scope.itemsPerPage = 4;
      $scope.selectedPhotos = [];

      // Get pictures from FB
      ApiSrv.getPhotos(currentAlbum)
         .then(function(res) {
            console.log("res in getPhotos :", res);
            $scope.count = res.data.count;
            $scope.photos = res.data.photos.data;
            let begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
            let end = begin + $scope.itemsPerPage;
            $scope.pagePhotos = $scope.photos.slice(begin, end);
            initLightBox();
            
         })
         .catch(function(err) {
            console.error("error while getting photos :", err);
         })


      $scope.setPage = function (pageNo) {
         $scope.currentPage = pageNo;
      };

      $scope.pageChanged = function() {
         console.log('Page changed to: ' + $scope.currentPage);
         let begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
         let end = begin + $scope.itemsPerPage;
         $scope.pagePhotos = $scope.photos.slice(begin, end);
         initLightBox();

      };

      $scope.selectPhoto = function(photo) {
         console.log("selectPhoto() for :", photo);
         if (!$scope.isPhotoSelected(photo.id, true)) {
            $scope.selectedPhotos.push(photo);
         }
         else{
            console.log("photo already selected beforehand :", photo.id);
            $scope.selectedPhotos = _.without($scope.selectedPhotos, photo);

         }
      }

      $scope.isPhotoSelected =  function(photoId, click) {
         return _.some($scope.selectedPhotos, function(sPhoto) {
            if (click) {
               console.log("sPhoto.id :", sPhoto.id);
               console.log("photoId :", photoId);
               
            }
            return sPhoto.id == photoId.toString();
         })
      }

      $scope.clearPhotoSelection = function() {
         $scope.selectedPhotos = [];
      }

      $scope.uploadPhotos = function() {
         console.log("$scope.selectedPhotos for upload:", $scope.selectedPhotos);
         ApiSrv.uploadPhotos($scope.selectedPhotos)
            .then(function(res){
               console.log("res in uploadPhotos :", res);
            })
            .catch(function(err) {
               console.error("error while uploading photos :", err);
            })
      }


      window.scp = $scope;
   })

