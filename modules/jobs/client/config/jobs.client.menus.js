'use strict';

angular.module('jobs').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Jobs',
      state: 'jobs',
      type: 'dropdown',
      roles: ['admin'],
      icon: 'fa-industry'
    });
  }
]);
