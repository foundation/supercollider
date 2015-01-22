#!/usr/bin/env node

var superc = require('./super');

superc({
  html: './scss',
  sass: './scss',
  js: './js/**/*.js',
  destJSON: 'docs.json',
  dest: './build'
});