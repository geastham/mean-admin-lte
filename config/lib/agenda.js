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
    _.extend(jobTypes, require('./../../' + jobs)(function(moduleName, jobName, interval, derivedJobName, data, cb) {

      // Define job using agenda API
      agenda.define(derivedJobName, function(job, done) {
        // Extend data with module and job
        var jobData = _.extend(job.attrs.data, { moduleName: moduleName, jobName: jobName, derivedJobName: derivedJobName });

        // Execut job callback
        if(cb) {
          try {
            cb(jobData);
          } catch (err) {
            console.log("Caught failed job! - " + derivedJobName);
            job.fail(err); // call Agenda fail function
            job.save(); // save updated job
          }
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
          jobTypes[job.attrs.data.moduleName][job.attrs.data.jobName](interval, job.attrs.data, null,
            // Failure callback
            function(message) {
              console.log(message);
            }
          );

          console.log("\nLoaded " + job.attrs.data.derivedJobName + " into active memory with interval " + job.attrs.repeatInterval);

          // Check to see if the job's next run already passed (and if so, fire the job)
          if(job.attrs.nextRunAt) {
            if(job.attrs.nextRunAt < Date.now()) { 
              console.log("--> Triggering " + job.attrs.data.derivedJobName + " to fire immediately.");
              job.run(function(err, job) {});
            } else {
              console.log("--> Scheduling startup:" + job.attrs.data.derivedJobName + " to fire " + job.attrs.nextRunAt);

              // Create a one-time startup job to run a loaded job at the desired startup time
              agenda.define("startup:" + job.attrs.data.derivedJobName, function(startupJob, done) {
                job.run(function(err, job) {});
                done();
              });

              agenda.schedule(job.attrs.nextRunAt, "startup:" + job.attrs.data.derivedJobName, {
                jobName: "startup",
                derivedJobName: "startup:" + job.attrs.data.derivedJobName
              });
            }
          }
        }
      });
    }
  });

  // Add jobTypes to agenda object
  agenda.jobTypes = jobTypes;

  // Setup recurrance
  agenda.on('ready', function() {
    // Create indexes
    agenda._collection.createIndexes([
      {key: { nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 }},
      {key: { name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 }}
    ], function (err, result) {
      if (err) {
        console.warn('Jobs module indexes might not exist. Performance may decrease.');
      }
    });

    // Start agenda
    agenda.start();
  });
  
  return agenda;
};
