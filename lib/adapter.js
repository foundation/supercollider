var path = require('path');

module.exports = function(name, func) {
  // Don't double-dip on adapters
  if (this.adapters[name]) {
    throw new Error('"'+name+'" is already a Supercollider adapter.');
  }

  // Don't use one of the built-in meta terms
  var reserved = ['docs', 'fileName'];
  for (var i in reserved) {
    if (name === reserved[i]) {
      throw new Error('"'+name+'" is a reserved keyword, and can\'t be used as the name of a Supercollider adapter.');
    }
  }

  // Make sure the adapter is an object with both of the required methods.
  if (typeof func !== 'function') {
    throw new Error('Supercollider adapters must be functions.')
  }

  this.adapters[name] = func;
}
