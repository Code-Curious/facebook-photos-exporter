angular.module('app')
   .controller('LoginCtrl', function($http, $scope, $window, ApiSrv, socket) {
      console.log("hello from LoginCtrl");
      $scope.FbLogin = function() {
         console.log('$window.location before :', $window.location);
         $window.location = 'http://localhost:3000/auth/facebook'; // TOFIX: Bad practice
         console.log('$window.location after :', $window.location);
      }
   })


