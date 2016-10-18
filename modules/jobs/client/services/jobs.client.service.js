'use strict';

// Jobs service used for communicating with the post REST endpoints
angular.module('jobs').factory('Jobs', ['$http',
  function ($http) {
    // --- Private Methods ---
    function handleSuccess( response ) {
        return( response.data );
    }

    // --- Public Methods ---
    return {
      // Lists all jobs given query
      list: function(query) {
        var request = $http({
          method: "POST",
          url: "api/jobs/list"
        });
        return( request.then( handleSuccess ) );
      }
    };
  }
]);
