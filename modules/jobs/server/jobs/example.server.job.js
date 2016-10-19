'use strict';

/**
 * Module dependencies.
 */
// var foo = require('bar')

// Set global module namespace
var moduleName = "exampleJobs"

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
		printToConsole: function(interval, data) {
			if(data.identifer && data.message) {
				agenda.define('printToConsole - ' + data.identifier, function(job, done) {
					console.log(job.attrs.data.message);
				});
			}
		}
	};

	// Return jobs object
	return jobs;
};