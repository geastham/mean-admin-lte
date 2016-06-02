'use strict';

//Menu service used for managing  menus
angular.module('core').service('Metadata', ['$state',
  function ($state) {
    // Set module defaults
    this.module = {
      header: 'Module Name',
      description: 'A brief description'
    };

    // Function for updating module meta-data based on passed in state
    var local = this;
    this.updateMetadata = function() {
      //console.info($state);
      if($state.current.data && $state.current.data.metadata) {
        this.module = $state.current.data.metadata;
        notifyObservers();
      }
    };

    // --- Observer callback pattern ---
    var observerCallbacks = [];

    // register an observer
    this.onChange = function(callback){
      observerCallbacks.push(callback);
    };

    // call this when you know 'foo' has been changed
    var notifyObservers = function(){
      angular.forEach(observerCallbacks, function(callback){
        callback();
      });
    };
  }
]);
