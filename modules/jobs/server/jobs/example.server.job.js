'use strict';

/**
 * Module dependencies.
 */
// var foo = require('bar')

// Set global module namespace
var moduleName = "exampleJobs";

module.exports = function(agenda) {
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
		 *
		 */
		printToConsole: function(interval, data, successCallback, failureCallback) {
			// Parsed data
			var parsedData = JSON.parse(data);

			// If necessary data parameters exist -- create job
			if(parsedData.identifier && parsedData.message) {
				// Create derived job name
				var derivedJobName = moduleName + ':printToConsole:' + parsedData.identifier;

				// Define job
				agenda.define(derivedJobName, function(job, done) {
					console.log(job.attrs.data.message);
				});

				// Schedule job
				agenda.every(interval, derivedJobName, {
					moduleName: moduleName,
					jobName: "printToConsole",
					identifier: parsedData.identifier,
					message: parsedData.message
				});

				// Call success with data
				successCallback(derivedJobName);
			} else {
				failureCallback("Incorrect data parameters.");
			}
		}
	};

	// Return jobs object
	return jobs;
};