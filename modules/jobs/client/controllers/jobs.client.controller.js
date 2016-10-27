'use strict';

// Create the 'chat' controller
angular.module('jobs').controller('JobsController', ['$scope', '$location', '$state', 'Authentication', 'Metadata', 'Jobs', 
  function ($scope, $location, $state, Authentication, Metadata, Jobs) {
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

    // Initialize overview
    $scope.overview = {};

    // Initialize jobs
    $scope.initJobs = function() {
      // Load all jobs - initially
      Jobs.list().then(function(jobs) {
        console.log(jobs);
        $scope.jobs = jobs;
      });

      // Load overview for jobs -- initially
      Jobs.overview().then(function(overview) {
        console.log(overview[0]);
        $scope.overview = overview[0];
      });
    };
  }
]);
