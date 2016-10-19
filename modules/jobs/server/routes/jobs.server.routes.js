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
};
