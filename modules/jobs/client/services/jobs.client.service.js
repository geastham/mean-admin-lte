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
      list: function() {
        var request = $http({
          method: "GET",
          url: "api/jobs/"
        });
        return( request.then( handleSuccess ) );
      },
      // Lists all jobs given query
      create: function(job) {
        var request = $http({
          method: "POST",
          url: "api/jobs/",
          data: job
        });
        return( request.then( handleSuccess ) );
      },
      // Provides a job summary overview
      overview: function() {
        var request = $http({
          method: "GET",
          url: "api/jobs/overview"
        });
        return( request.then( handleSuccess ) );
      },
      // Finds specific jobs based on parameters
      find: function(query) {
        var request = $http({
          method: "POST",
          url: "api/jobs/find",
          data: query
        });
        return( request.then( handleSuccess ) );
      }
    };
  }
]);
