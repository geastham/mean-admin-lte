'use strict';

// Create the 'chat' controller
angular.module('jobs').controller('JobsController', ['$scope', '$location', '$state', 'Authentication', 'Metadata', 'Jobs', 
  function ($scope, $location, $state, Authentication, Metadata, Jobs) {
    // Update module metatdata
    Metadata.updateMetadata();

    // Initialize jobs
    $scope.jobs = [];

    // Initialize overview
    $scope.overview = {};

    // Initial job view refinement
    $scope.refinements = {
      job: null,
      query: null,
      state: null
    };

    // Initial job timer
    $scope.timer = null;

    // Initialize jobs
    $scope.initJobs = function() {
      // Load all jobs - initially
      Jobs.list().then(function(jobs) {
        console.log(jobs);
        $scope.jobs = jobs;
      });

      // Clear pre-existing timer
      if($scope.timer) {
        clearInterval($scope.timer);
      }

      // Set recurring check for jobs
      /*$scope.timer = setInterval(function() {
        Jobs.find($scope.refinements).then(function(jobs) {
          console.log(jobs);
          $scope.jobs = jobs;
        });
      }, 5000);*/

      // Load overview for jobs -- initially
      Jobs.overview().then(function(overview) {
        console.log(overview[0]);
        $scope.overview = overview[0];
      });
    };

    // Search for jobs
    $scope.searchJobs = function(keyEvent) {
      if (keyEvent.which === 13) {
        $scope.error = null;

        // Create new Post object
        console.log(keyEvent.target.value);
        $scope.refinements.query = keyEvent.target.value;

        // Trigger search
        Jobs.find($scope.refinements).then(function(jobs) {
          console.log(jobs);
          $scope.jobs = jobs;
        });
      }
    };

    // Filter by state
    $scope.filterState = function(clickEvent, state) {
      // Remove classes on siblings
      console.log(clickEvent.target);
      console.log(window.$(clickEvent.target).closest('li').siblings());
      window.$(clickEvent.target).closest('li').siblings().removeClass("active");

      window.$(clickEvent.target).closest('li').addClass("active");

      // Update state
      $scope.refinements.state = state;

      // Trigger search
      Jobs.find($scope.refinements).then(function(jobs) {
        console.log(jobs);
        $scope.jobs = jobs;
      });
    };
  }
]);
