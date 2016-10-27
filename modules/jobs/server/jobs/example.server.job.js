'use strict';

/**
 * Module dependencies.
 */
// var foo = require('bar')

// Set global module namespace
var moduleName = "exampleJobs";

// Set global job name
var jobName = "printToConsole";

module.exports = function(defineJob) {
	// Create jobs object
	var jobs = {};

	// Create jobs within module namespace
	jobs[moduleName] = {
		/*
		 *  Print to Console: prints a message to console
		 *  ---------------------
		 *  - Data Requirements -
		 *	* identifier: unique id to ensure unique job creation
		 *  * message: string message that you wish to print to console
		 */
		printToConsole: function(interval, data, successCallback, failureCallback) {
			// Parse data
			var parsedData = data;
			if(typeof data === "string") {
				parsedData = JSON.parse(data);
			}

			// If necessary data parameters exist -- create job
			if(parsedData.identifier && parsedData.message) {
				var startDate = (parsedData.startDate) ? parsedData.startDate : Date.now();

				// Create derived job name
				var derivedJobName = moduleName + ':' + jobName + ':' + parsedData.identifier; // new job at system startup

				// Define job
				defineJob(moduleName, jobName, interval, derivedJobName, {
			        startDate: startDate,
			        identifier: parsedData.identifier,
			        message: parsedData.message
				}, function(jobData) {
					console.log("[" + jobData.startDate + "] " + jobData.message);
				});

				// Call success with data
				if(successCallback) {
					successCallback(interval, derivedJobName);
				}
			} else {
				failureCallback("Incorrect data parameters.");
			}
		}
	};

	// Return jobs object
	return jobs;
};