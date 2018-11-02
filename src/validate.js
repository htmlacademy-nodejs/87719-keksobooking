'use strict';

const ValidationError = require(`./errors/validation-error`);
const {OFFER_FEATURES, OFFER_TYPE} = require(`./generateEntity`);

const validate = (data) => {
  const errors = [];
  const errorMessage = (error, fieldName, message) => {
    errors.push({
      'error': error,
      'fieldName': fieldName,
      'errorMessage': message
    });
  };
  const listIsRequired = [
    `avatar`,
    `title`,
    `type`,
    `price`,
    `address`,
    `checkin`,
    `checkout`,
    `rooms`,
  ];
  listIsRequired.forEach((it) => {
    if (!Object.keys(data).includes(it)) {
      errorMessage(`Validation Error`, it, `is required`);
    }
  });
  Object.keys(data).forEach((it) => {
    const value = data[it];
    if (listIsRequired.includes(it) && !value) {
      errorMessage(`Validation Error`, it, `is required`);
    }
    switch (it) {
      case `title`:
        if (value < 30 || value > 140) {
          errorMessage(`Validation Error`, it, `"${it}" shoult be more 30 and less 140`);
        }
        break;
      case `type`:
        if (!OFFER_TYPE.includes(value)) {
          errorMessage(`Validation Error`, it, `"${it}" shoult be one from ${JSON.stringify(OFFER_TYPE)}`);
        }
        break;
      case `price`:
        if (value < 0 || value > 100000) {
          errorMessage(`Validation Error`, it, `"${it}" shoult be more 0 and less 100000`);
        }
        break;
      case `address`:
        if (value.length > 100) {
          errorMessage(`Validation Error`, it, `"${it}" length shoult be less 100`);
        }
        break;
      case `checkin`:
      case `checkout`:
        const split = value.split(`:`);
        if (split.length !== 2 || split[0].length !== 2 || (split[1] && split[1].length !== 2)) {
          errorMessage(`Validation Error`, it, `"${it}" length shoult match HH:mm`);
        }
        break;
      case `rooms`:
        if (value < 0 || value > 1000) {
          errorMessage(`Validation Error`, it, `"${it}" shoult be more 0 and less 1000`);
        }
        break;
      case `features`:
        const filteredFeatures = value.filter((item) => !OFFER_FEATURES.includes(item));
        if (filteredFeatures.length) {
          errorMessage(`Validation Error`, it, `"${it}" shoult be one from ${JSON.stringify(OFFER_FEATURES)}`);
        }
        break;
      default:
        break;
    }
  });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = validate;
