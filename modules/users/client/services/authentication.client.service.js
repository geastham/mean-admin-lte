'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', '$location',
  function ($window, $location) {
    var auth = {
      user: $window.user
    };

    // Intercept non-logged in users
    if(!auth.user) {
    	console.info("Not loggged in!");

    	// Redirect to signin page
        $location.path('authentication/signin');
    }

    return auth;
  }
]);
