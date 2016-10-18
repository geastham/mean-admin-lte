'use strict';

// Create the 'chat' controller
angular.module('jobs').controller('JobsController', ['$scope', '$location', '$state', 'Authentication', 'Metadata',
  function ($scope, $location, $state, Authentication, Metadata) {
    // Update module metatdata
    Metadata.updateMetadata();

    
  }
]);
