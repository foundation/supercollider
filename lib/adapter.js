var path = require('path');

module.exports = function(name, func) {
  // Load a built-in module if available
  if (typeof func === 'undefined') {
    try {
      func = require(path.join('../adapters/', name));
    }
    catch (e) {
      throw new Error('"'+name+'" is not a built-in Supercollider adapter.');
    }
  }

  // Don't use one of the built-in meta terms
  var reserved = ['docs', 'fileName', '_adapterData'];
  for (var i in reserved) {
    if (name === reserved[i]) {
      throw new Error('"'+name+'" is a reserved keyword, and can\'t be used as the name of a Supercollider adapter.');
    }
  }

  // Make sure the adapter is an object with both of the required methods.
  if (typeof func !== 'function') {
    throw new Error('Supercollider adapters must be functions.')
  }

  // If no config object exists, add it
  if (!func.config) func.config = {};

  this.adapters[name] = func;

  return this;
}
