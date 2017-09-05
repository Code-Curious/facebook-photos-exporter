angular.module('app', ['ngRoute'])
   .config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true); // remove # from urls

      $routeProvider
      .when('/albums',{
         templateUrl: 'app/views/albums.html',
         // template: '<h2>HELLOOOO ALBUMS</h2>',
         controller: 'AlbumsCtrl',
      })
      .when('/photos',{
         templateUrl: 'app/views/photos.html',
         controller: 'PhotosCtrl',
      })
      .when('/uploads',{
         templateUrl: 'app/views/uploads.html',
         controller: 'UploadsCtrl',
      })
      .when('/login',{
         templateUrl: 'app/views/login.html',
         controller: 'LoginCtrl',
      })
   })