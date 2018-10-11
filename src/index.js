'use strict';
const version = require(`./version`);
const help = require(`./help`);
const author = require(`./author`);
const license = require(`./license`);
const description = require(`./description`);
const undef = require(`./undef`);
const server = require(`./server`);

module.exports = [
  version,
  help,
  author,
  license,
  description,
  undef,
  server,
];
