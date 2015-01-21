#!/usr/bin/env node

var superc = require('./super');

superc({
  html: './scss',
  sass: './scss',
  js: './js/button.js',
  dest: 'docs.json'
});