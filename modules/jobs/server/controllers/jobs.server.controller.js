'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    _ = require('lodash');

/**
 * List all jobs
 */
exports.list = function (req, res) {
  // Grab agenda instance
  var agenda = req.app.get('agenda');

  if(agenda) {
    agenda.jobs({}, function(err, jobs) {
      if(err) {
        res.json({
          status: "FAILED",
          message: err
        });
      }

      // Pass along jobs results
      res.json(jobs);
    });
  } else {
    res.json({
      status: "FAILED",
      message: "ERROR: Could not get agenda object"
    });
  }
};

/**
 * Create a new job
 */
exports.create = function (req, res) {
  // Grab job creation info
  var moduleName = req.body.moduleName;
  var jobName = req.body.jobName;

  // Grab desired job interval
  var interval = req.body.interval ? req.body.interval : ''; // assume no repeat if not set

  // Grab data payload
  var data = req.body.data ? req.body.data : {}; // assume no data if not set

  // Grab agenda instance
  var agenda = req.app.get('agenda');

  // If agenda exists - create the job
  if(agenda) {
    // Lookup module name parameters
    if(agenda.jobTypes && _.has(agenda.jobTypes, moduleName) && agenda.jobTypes[jobName]) {
      // Call configured job type with parsed data
      agenda.jobTypes[moduleName][jobName](interval, data,
        // Success callback
        function(derivedJobName) {
          res.json({
            status: "SUCCESS",
            message: "Created new job: " + derivedJobName
          });
        },
        // Failure callback
        function(failureMessage) {
          res.json({
            status: "FAILED",
            message: failureMessage
          });
        }
      );
    } else {
      res.json({
        status: "FAILED",
        message: "ERROR: Could not find the appropriate configured module [" + module + "] and job name [" + jobName + "]"
      });
    }
  } else {
    // Return error message
    res.json({
      status: "FAILED",
      message: "ERROR: Could not get agenda object"
    });
  }
};


