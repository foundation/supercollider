#!/usr/bin/env node

var superc = require('./super');

superc({
  html: './scss',
  sass: './scss',
  dest: 'docs.json'
});