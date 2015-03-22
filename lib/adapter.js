var path = require('path');

module.exports = function(name, obj) {
  // Don't double-dip on adapters
  if (this.adapters[name]) {
    throw new Error('"'+name+'" is already a Supercollider adapter.');
  }

  // Don't use one of the built-in meta terms
  var reserved = ['title', 'description', 'fileName'];
  for (var i in reserved) {
    if (name === reserved[i]) {
      throw new Error('"'+name+'" is a reserved keyword, and can\'t be used as the name of a Supercollider adapter.');
    }
  }

  // Make sure the adapter is an object with both of the required methods.
  if (typeof obj !== 'object') {
    throw new Error('Supercollider adapters must be objects.')
  }
  if (obj.parse && typeof obj.parse !== 'function') {
    throw new Error('Supercollider adapters must have a method called "parse".');
  }
  if (obj.parse && typeof obj.process !== 'function') {
    throw new Error('Supercollider adapters must have a method called "process".');
  }

  this.adapters[name] = obj;
}