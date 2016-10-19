'use strict';

// Load the module dependencies
var Agenda = require('agenda'),
    _ = require('lodash');

// Initialize agenda and make globally accessible
module.exports = function (app, db) {
  //console.log(db.connections[0].db);

  // Initialize agenda instance
  var agenda = new Agenda({ mongo: db.connections[0].db, db: { collection: "jobs" } });

  // Setup recurrance
  agenda.on('ready', function() {
    /*agenda.define('hello world', function(job, done) {
      console.log("Hello world...");
      done();
    });*/

    // run say hello
    agenda.every('2 seconds', 'hello world');

    // Start agenda
    agenda.start();
  });
  
  return agenda;
};
