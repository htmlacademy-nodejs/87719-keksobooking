'use strict';
const version = require(`./version`);
const help = require(`./help`);
const author = require(`./author`);
const license = require(`./license`);
const description = require(`./description`);
const undef = require(`./undef`);
const server = require(`./server`);
const generate = require(`./generate`);
const fill = require(`./fill`);

module.exports = [
  version,
  help,
  author,
  license,
  description,
  undef,
  server,
  generate,
  fill,
];
