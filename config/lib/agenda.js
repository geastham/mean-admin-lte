'use strict';

// Load the module dependencies
var Agenda = require('agenda'),
    _ = require('lodash');

// Initialize agenda and make globally accessible
module.exports = function (app, db, jobs) {
  // Initialize agenda instance
  var agenda = new Agenda({ mongo: db.connections[0].db, db: { collection: "jobs" }, processEvery: '5 seconds' });

  // Load job types (define in each module)
  var jobTypes = {};

  // Iterate over each modules jobs and initialize
  _.forEach(jobs, function(jobs) {
    _.extend(jobTypes, require('./../../' + jobs)(function(interval, derivedJobName, data, cb) {
      agenda.define(derivedJobName, function(job, done) {
        if(cb) {
          cb(job.attrs.data);
        }
        done(); // Make sure to call - otherwise jobs do not run
      });

      // Schedule job
      agenda.every(interval, derivedJobName, data);
    }));
  });

  // Get all configured jobs and load them into memory
  agenda.jobs({}, function(err, jobs) {
    if(!err) {
      _.forEach(jobs, function(job) {
        if(job.attrs.data && job.attrs.data.moduleName && job.attrs.data.jobName) {
          // Call each job's init function
          var interval = (job.attrs.repeatInterval) ? job.attrs.repeatInterval : '';
          jobTypes[job.attrs.data.moduleName][job.attrs.data.jobName](interval, job.attrs.data,
            // Success callback
            function(interval, derivedJobName) {
              console.log("Loaded " + derivedJobName + " into active memory with interval " + interval);

              // Check to see if the job's next run already passed (and if so, fire the job)
              if(job.attrs.nextRunAt) {
                if(job.attrs.nextRunAt < Date.now()) { 
                  console.log("--> Triggering " + derivedJobName + " to fire immediately.");
                  job.run(function(err, job) {});
                } else {
                  console.log("--> Scheduling startup:" + derivedJobName + " to fire " + job.attrs.nextRunAt);

                  // Create a one-time startup job to run a loaded job at the desired startup time
                  agenda.define("startup:" + derivedJobName, function(startupJob, done) {
                    job.run(function(err, job) {});
                    done();
                  });

                  agenda.schedule(job.attrs.nextRunAt, "startup:" + derivedJobName);
                }
              }
            },

            // Failure callback
            function(message) {
              console.log(message);
            }
          );
        }
      });
    }
  });

  // Add jobTypes to agenda object
  agenda.jobTypes = jobTypes;

  // Setup recurrance
  agenda.on('ready', function() {
    // Start agenda
    agenda.start();
  });
  
  return agenda;
};
