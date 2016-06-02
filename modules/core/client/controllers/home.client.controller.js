'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication', 'Metadata',
  function ($scope, $state, Authentication, Metadata) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Update module metatdata
    //Metadata.updateMetadata();

    // update scope outside of current controller
    //var appElement = document.querySelector('[ng-app=]');
  }
]);
