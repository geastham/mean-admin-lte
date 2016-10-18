'use strict';

// Configure the 'chat' module routes
angular.module('jobs').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('jobs', {
        url: '/jobs',
        templateUrl: 'modules/jobs/client/views/jobs.client.view.html',
        data: {
          roles: ['admin'],
          metadata: {
            header: 'Job Management',
            description: 'Monitor, edit and manage on-going and new platform jobs'
          }
        }
      });
  }
]);
