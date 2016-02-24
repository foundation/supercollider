var Renderer = require('marked').Renderer;

var renderer = new Renderer();

renderer.heading = function() {
  return kittens.length;
}

module.exports = renderer;
