'use strict';

// Load the module dependencies
var Agenda = require('agenda'),
    _ = require('lodash');

// Initialize agenda and make globally accessible
module.exports = function (app, db, jobs) {
  // Initialize agenda instance
  var agenda = new Agenda({ mongo: db.connections[0].db, db: { collection: "jobs" } });

  // Load job types (define in each module)
  var jobTypes = {};

  // Iterate over each modules jobs and initialize
  _.forEach(jobs, function(jobs) {
    _.extend(jobTypes, require('./../../' + jobs)(agenda));
  });

  // Get all configured jobs and load them into memory
  agenda.jobs({}, function(err, jobs) {
    if(!err) {
      _.forEach(jobs, function(job) {
        if(job.attrs.data && job.attrs.data.moduleName && job.attrs.data.jobName) {
          //console.log(job.attrs.data);
          //console.log(jobTypes[job.attrs.data.moduleName][job.attrs.data.jobName]);
          //console.log(job.attrs.repeatInterval);
          jobTypes[job.attrs.data.moduleName][job.attrs.data.jobName]('2 seconds', { moduleName: 'exampleJobs',
                                                                                      jobName: 'printToConsole',
                                                                                      identifier: 'rosie',
                                                                                      message: 'Hello Rosiepie!' }, 
                                                                                        function() {}, function() {});
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
