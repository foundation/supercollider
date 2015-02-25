require 'hologram'
require 'json'

plugins = Hologram::Plugins.new({}, []);
parser = Hologram::DocParser.new(ARGF.argv[0], nil, plugins)
puts JSON.generate(parser.parse)
