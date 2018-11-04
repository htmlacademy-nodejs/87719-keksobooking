'use strict';
const commands = require(`./`);

module.exports = (params) => {
  const command = commands.find((item) => `--${item.name}` === params[0]);

  if (command) {
    if (command.name === `help`) {
      command.execute(commands);
    } else {
      command.execute(...params.filter((item, index) => index > 0));
    }
  } else {
    commands.find((item) => item.name === `undef`).execute();
    commands.find((item) => item.name === `help`).execute(commands);
    process.exit(1);
  }
};
