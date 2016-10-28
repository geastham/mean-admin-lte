'use strict';

/**
 * Module dependencies.
 */
var jobs = require('../controllers/jobs.server.controller');

module.exports = function (app) {
  // Jobs collection routes
  app.route('/api/jobs/')
    .get(jobs.list)
    .post(jobs.create);

  // Jobs colelction overview
  app.route('/api/jobs/overview')
    .get(jobs.overview);

  // Jobs advanced search
  app.route('/api/jobs/find')
    .post(jobs.find);

  // Jobs wait support
  app.route('/api/jobs/test/wait')
    .post(jobs.wait);
};
