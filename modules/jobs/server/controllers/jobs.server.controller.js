'use strict';

/**
 * Module dependencies.
 */
var request = require('request');

/**
 * List all jobs
 */
exports.list = function (req, res) {
  // Grab agenda instance
  var agenda = req.app.get('agenda');

  req.json("list jobs...");
};

/**
 * Create a new job
 */
exports.create = function (req, res) {
  // Grab job creation info
  var moduleName = req.body.moduleName;
  var jobType = req.body.jobType;

  // Grab data payload
  var data = req.body.data ? req.body.data : {};

  // Grab agenda instance
  var agenda = req.app.get('agenda');

  // If agenda exists - create the job
  if(agenda) {
    // Define job by loading from jobs directory
    //require('./../jobs/example.server.job')(agenda);

    // Return request
    res.json({
      status: "SUCCESS",
      message: "Created new job: Say Hello"
    });
  } else {
    // Return error message
    res.json({
      status: "FAILED",
      message: "ERROR: Could not get agenda object."
    });
  }
};


