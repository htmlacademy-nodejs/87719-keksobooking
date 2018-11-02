'use strict';

const {getData} = require(`../generateEntity`);
const offersStore = require(`../store`);

module.exports = {
  name: `fill`,
  description: `Fill test data`,
  execute: () => {
    offersStore.saveMany(getData(10));
    process.exit();
  }
};
