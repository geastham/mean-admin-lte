'use strict';

// Load the module dependencies
var Agenda = require('agenda');

// Initialize agenda and make globally accessible
module.exports = function (app, db) {
  // Initialize agenda instance
  var agenda = new Agenda(db.connections[0].collection('jobs'));
  
  return agenda;
};
