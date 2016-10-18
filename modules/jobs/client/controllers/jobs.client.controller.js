'use strict';

// Create the 'chat' controller
angular.module('jobs').controller('JobsController', ['$scope', '$location', '$state', 'Authentication', 'Metadata',
  function ($scope, $location, $state, Authentication, Metadata) {
    // Update module metatdata
    Metadata.updateMetadata();

    // Initialize jobs
    $scope.jobs = [
      {
        status: ['Scheduled', 'Completed'],
        name: 'getEvents',
        lastRunStarted: '2 minutes ago',
        nextRun: 'In 3 minutes',
        lastRunFinished: '2 minutes ago',
        locked: false
      }
    ];
  }
]);
