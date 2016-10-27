'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    _ = require('lodash');

/*
 *  GetJobs -- helper function
 *  Credit: https://github.com/joeframbach/agendash/blob/master/lib/agendash.js#L207-L271
 */
function getJobs (agenda, job, state, callback) {
  var preMatch = {};
  if (job) preMatch.name = job;

  var postMatch = {};
  if (state) postMatch[state] = true;

  var limit = 200; // todo UI param
  var skip = 0; // todo UI param

  agenda._collection.aggregate([
    {$match: preMatch},
    {$sort: {
      nextRunAt: -1,
      lastRunAt: -1,
      lastFinishedAt: -1
    }},
    {$project: {
      _id: 0,
      job: '$$ROOT',
      nextRunAt: {$ifNull: ['$nextRunAt', 0]},
      lockedAt: {$ifNull: ['$lockedAt', 0]},
      lastRunAt: {$ifNull: ['$lastRunAt', 0]},
      lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
      failedAt: {$ifNull: ['$failedAt', 0]},
      repeatInterval: {$ifNull: ['$repeatInterval', 0]}
    }},
    {$project: {
      job: '$job',
      _id: '$job._id',
      running: {$and: [
        '$lastRunAt',
        {$gt: [ '$lastRunAt', '$lastFinishedAt' ]}
      ]},
      scheduled: {$and: [
        '$nextRunAt',
        {$gte: [ '$nextRunAt', new Date() ]}
      ]},
      queued: {$and: [
        '$nextRunAt',
        {$gte: [ new Date(), '$nextRunAt' ]},
        {$gte: [ '$nextRunAt', '$lastFinishedAt' ]}
      ]},
      completed: {$and: [
        '$lastFinishedAt',
        {$gt: ['$lastFinishedAt', '$failedAt']}
      ]},
      failed: {$and: [
        '$lastFinishedAt',
        '$failedAt',
        {$eq: ['$lastFinishedAt', '$failedAt']}
      ]},
      repeating: {$and: [
        '$repeatInterval',
        {$ne: ['$repeatInterval', null]}
      ]}
    }},
    {$match: postMatch},
    {$limit: limit},
    {$skip: skip}
  ]).toArray(function (err, results) {
    if (err) return callback(err);
    callback(null, results);
  });
}

/**
 * List all jobs
 */
exports.list = function (req, res) {
  // Grab agenda instance
  var agenda = req.app.get('agenda');

  if(agenda) {
    // Leverage getJob function
    getJobs(agenda, null, null, function(err, jobs) {
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
 * Advanced search for jobs
 */
exports.find = function(req, res) {
  // Grab agenda instance
  var agenda = req.app.get('agenda');

  // Get query parameters
  var job = req.body.job;
  var state = req.body.state;

  if(agenda) {
    // Leverage getJob function
    getJobs(agenda, function(err, jobs) {
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

/*
 *  GetOverview -- helper function
 *  Credit: https://github.com/joeframbach/agendash/blob/master/lib/agendash.js#L123-L205
 */
function getOverview (agenda, callback) {
  agenda._collection.aggregate([
    {$project: {
      _id: 0,
      name: '$name',
      type: '$type',
      priority: '$priority',
      repeatInterval: '$repeatInterval',
      repeatTimezone: '$repeatTimezone',
      nextRunAt: {$ifNull: ['$nextRunAt', 0]},
      lockedAt: {$ifNull: ['$lockedAt', 0]},
      lastRunAt: {$ifNull: ['$lastRunAt', 0]},
      lastFinishedAt: {$ifNull: ['$lastFinishedAt', 0]},
      failedAt: {$ifNull: ['$failedAt', 0]}
    }},
    {$project: {
      name: '$name',
      type: '$type',
      priority: '$priority',
      repeatInterval: '$repeatInterval',
      repeatTimezone: '$repeatTimezone',
      running: {$cond: [{$and: [
        '$lastRunAt',
        {$gt: [ '$lastRunAt', '$lastFinishedAt' ]}
      ]}, 1, 0]},
      scheduled: {$cond: [{$and: [
        '$nextRunAt',
        {$gte: [ '$nextRunAt', new Date() ]}
      ]}, 1, 0]},
      queued: {$cond: [{$and: [
        '$nextRunAt',
        {$gte: [ new Date(), '$nextRunAt' ]},
        {$gte: [ '$nextRunAt', '$lastFinishedAt' ]}
      ]}, 1, 0]},
      completed: {$cond: [{$and: [
        '$lastFinishedAt',
        {$gt: ['$lastFinishedAt', '$failedAt']}
      ]}, 1, 0]},
      failed: {$cond: [{$and: [
        '$lastFinishedAt',
        '$failedAt',
        {$eq: ['$lastFinishedAt', '$failedAt']}
      ]}, 1, 0]},
      repeating: {$cond: [{$and: [
        '$repeatInterval',
        {$ne: ['$repeatInterval', null]}
      ]}, 1, 0]}
    }},
    {$group: {
      _id: '$name',
      displayName: {$first: '$name'},
      meta: {$addToSet: {
        type: '$type',
        priority: '$priority',
        repeatInterval: '$repeatInterval',
        repeatTimezone: '$repeatTimezone'
      }},
      total: {$sum: 1},
      running: {$sum: '$running'},
      scheduled: {$sum: '$scheduled'},
      queued: {$sum: '$queued'},
      completed: {$sum: '$completed'},
      failed: {$sum: '$failed'},
      repeating: {$sum: '$repeating'}
    }}
  ]).toArray(function (err, results) {
    if (err) return callback(err);
    var totals = {
      displayName: 'All Jobs'
    };
    var states = ['total', 'running', 'scheduled', 'queued', 'completed', 'failed', 'repeating'];
    states.forEach(function (state) {
      totals[state] = 0;
    });
    results.forEach(function (job) {
      states.forEach(function (state) {
        totals[state] += job[state];
      });
    });
    results.unshift(totals);
    callback(null, results);
  });
}

/**
 * List all jobs
 */
exports.overview = function(req, res) {
  // Grab agenda instance
  var agenda = req.app.get('agenda');

  if(agenda) {
    // Leverage getJob function
    getOverview(agenda, function(err, overview) {
      if(err) {
          res.json({
            status: "FAILED",
            message: err
          });
        }

        // Pass along jobs results
        res.json(overview);
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
    if(agenda.jobTypes && _.has(agenda.jobTypes, moduleName) && agenda.jobTypes[moduleName][jobName]) {
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
        message: "ERROR: Could not find the appropriate configured module [" + moduleName + "] and job name [" + jobName + "]"
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


