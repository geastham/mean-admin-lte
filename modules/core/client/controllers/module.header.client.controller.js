'use strict';

angular.module('core').controller('ModuleHeaderController', ['$scope', '$state',
  function ($scope, $state) {

    console.info($state.current);

    // Set metadata for module header
    $scope.metadata = ($state.current.data && $state.current.data.metadata) ? $state.current.data.metadata : {
      header: 'Page Header',
      description: 'Optional description'
    }
  }
]);
