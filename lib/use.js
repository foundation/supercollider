var path = require('path');

module.exports = function(name, obj) {
  try {
    obj = require(path.join(__dirname, '..', 'adapters', name));
  }
  catch(e) {
    console.log(e);
    if (typeof obj !== 'object') {
      throw new Error('Supercollider adapters must be objects.')
    }
    else if (obj.parse && typeof obj.parse !== 'function') {
      throw new Error('Supercollider adapters must have a method called "parse".');
    }
  }

  this._adapters[name] = obj;
}