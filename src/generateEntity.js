'use strict';
const {genetateNumber, shuffle, getRandomValue, getRandomValues} = require(`./utils`);

const OFFER_TITLE = [
  `Большая уютная квартира`,
  `Маленькая неуютная квартира`,
  `Огромный прекрасный дворец`,
  `Маленький ужасный дворец`,
  `Красивый гостевой домик`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от моря`,
  `Неуютное бунгало по колено в воде`
];
const OFFER_TYPE = [
  `flat`,
  `palace`,
  `house`,
  `bungalo`
];
const REGISTER_TIME = [`12:00`, `13:00`, `14:00`];
const OFFER_FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];
const OFFER_PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const getLocation = () => {
  return {
    x: genetateNumber(300, 900),
    y: genetateNumber(150, 500)
  };
};

const NAME = [
  `Keks`,
  `Pavel`,
  `Nikolay`,
  `Alex`,
  `Ulyana`,
  `Anastasyia`,
  `Julia`
];

const getData = (count) => {
  return new Array(count).fill().map(() => {
    return {
      author: {
        avatar: `https://robohash.org/${genetateNumber(1, 9)}.jpg`,
        name: getRandomValue(NAME),
      },
      offer: {
        title: getRandomValue(OFFER_TITLE),
        address: `${getLocation().x}, ${getLocation().y}`,
        price: genetateNumber(1000, 1000000),
        type: getRandomValue(OFFER_TYPE),
        rooms: genetateNumber(1, 5),
        guests: genetateNumber(1, 5),
        checkin: getRandomValue(REGISTER_TIME),
        checkout: getRandomValue(REGISTER_TIME),
        features: getRandomValues(OFFER_FEATURES),
        description: ``,
        photos: shuffle(OFFER_PHOTOS),
      },
      location: getLocation(),
      date: genetateNumber(new Date().valueOf() - 3600 * 24 * 7, new Date().valueOf())
    };
  });
};

module.exports = {
  OFFER_TITLE,
  OFFER_TYPE,
  REGISTER_TIME,
  OFFER_FEATURES,
  OFFER_PHOTOS,
  getLocation,
  getData,
  NAME,
};
