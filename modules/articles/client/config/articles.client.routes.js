'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>',
        data: {
          metadata: {
            header: 'Articles',
            description: 'Create and edit existing or new articles'
          }
        }
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        data: {
          metadata: {
            header: 'Existing Articles',
            description: 'These are all the current existing articles'
          }
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin'],
          metadata: {
            header: 'New Article',
            description: 'Create a new article'
          }
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html',
        data: {
          metadata: {
            header: 'View Article',
            description: 'View this article contents'
          }
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin'],
          metadata: {
            header: 'Edit Article',
            description: 'Edit this article contents'
          }
        }
      });
  }
]);
