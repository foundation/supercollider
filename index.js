#!/usr/bin/env node

var superc = require('./super');

superc({
  sass: './scss',
  dest: 'super.json'
});