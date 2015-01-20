require 'hologram'
require 'json'

plugins = Hologram::Plugins.new({}, []);
parser = Hologram::DocParser.new('./scss', nil, plugins)
puts JSON.generate(parser.parse)