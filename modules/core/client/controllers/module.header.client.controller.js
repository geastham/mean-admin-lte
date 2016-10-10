'use strict';

angular.module('core').controller('ModuleHeaderController', ['$scope', '$state', 'Metadata',
  function ($scope, $state, Metadata) {
    // Set initial metadata
    $scope.metadata = Metadata.module;

    // Create scope update callback
    var updateScope = function() {
      $scope.metadata = Metadata.module;
    };

    // Watch for external changes to metadata
    Metadata.onChange(updateScope);
  }
]);
