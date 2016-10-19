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
  // Grab message
  var message = req.body.message ? req.body.message : "... nothing to say.";

  // Grab agenda instance
  var agenda = req.app.get('agenda');

  // If agenda exists - create the job
  if(agenda) {
    // Define job by loading from jobs directory
    //require('./../jobs/example.server.job')(agenda);

    // Start jobs
    //agenda.every('10 seconds', 'say hello');
    //agenda.start(); // trigger queue process

    agenda.define('hello world', function(job, done) {
      console.log("Hello: " + message);
      done();
    });

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


