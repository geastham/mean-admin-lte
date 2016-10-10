'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Hide all other parts of the UI
    window.$('header').hide();
    window.$('.content-header').hide();
    window.$('aside').hide();
    window.$('.content-wrapper').css({ 'margin-left' : '0px'});
    window.$('.content').css({ 'padding-top' : '0px'});

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);

        // Unhide all other parts of the UI
        window.$('header').show();
        window.$('.content-header').show();
        window.$('aside').show();
        window.$('.content-wrapper').css({ 'margin-left' : '230px'});
        window.$('.content').css({ 'padding-top' : '15px'});
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);

        // Unhide all other parts of the UI
        window.$('header').show();
        window.$('.content-header').show();
        window.$('aside').show();
        window.$('.content-wrapper').css({ 'margin-left' : '230px'});
        window.$('.content').css({ 'padding-top' : '15px'});
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
