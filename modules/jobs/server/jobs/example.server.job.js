'use strict';

/**
 * Module dependencies.
 */
var request = require('request');

// Set global module namespace
var moduleName = "exampleJobs";

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
		printToConsole: function(interval, parsedData, successCallback, failureCallback) {
			// Set local job name
			var jobName = "printToConsole";

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
		},

		/*	Always Fails: example of a job that always fails
		 *  ---------------------
		 */
		alwaysFails: function(interval, parsedData, successCallback) {
			// Set local job name
			var jobName = "alwaysFails";

			// Define job
			var startDate = (parsedData.startDate) ? parsedData.startDate : Date.now();
			defineJob(moduleName, jobName, interval, jobName + ":" + startDate, {startDate: startDate}, function(jobData) {
				console.log("[" + jobData.startDate + "] - About to fail this job again.");
				throw "AlwaysFails - fails again!";
			});

			// Call success with data
			if(successCallback) {
				successCallback(interval, jobName + ":" + startDate);
			}
		}
	};

	// Return jobs object
	return jobs;
};