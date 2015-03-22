var path = require('path');

module.exports = function(name, obj) {
  // Don't double-dip on adapters
  if (this._adapters[name]) {
    throw new Error('"'+name+'" is already a Supercollider adapter.');
  }

  // Don't use one of the built-in meta terms
  var reserved = ['title', 'description', 'fileName'];
  for (var i in reserved) {
    if (name === reserved[i]) {
      throw new Error('"'+name+'" is a reserved keyword, and can\'t be used as the name of a Supercollider adapter.');
    }
  }

  // Try to import one of the built-in adapters
  try {
    obj = require(path.join(__dirname, '..', 'adapters', name));
  }
  catch(e) {
    if (typeof obj !== 'object') {
      throw new Error('Supercollider adapters must be objects.')
    }
    else if (obj.parse && typeof obj.parse !== 'function') {
      throw new Error('Supercollider adapters must have a method called "parse".');
    }
  }

  this._adapters[name] = obj;
}