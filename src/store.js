'use strict';

const db = require(`./database/db`);
const logger = require(`../logger`);
const {getRandomValue} = require(`./utils`);
const {NAME} = require(`./generateEntity.js`);

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`offers`);
  collection.createIndex({date: -1}, {unique: true});
  return collection;
};

const checkData = (data) => ({
  author: {
    avatar: data.avatar,
    name: data.name || getRandomValue(NAME)
  },
  offer: {
    title: data.title,
    address: data.address,
    price: data.price,
    type: data.type,
    rooms: data.rooms,
    guests: data.quests,
    checkin: data.checkin,
    checkout: data.checkout,
    features: data.features || [],
    description: ``,
    photos: data.photos || [],
  },
  location: {
    x: data.address.split(`,`)[0].trim(),
    y: data.address.split(`,`)[1].trim()
  },
  date: new Date().valueOf()
});

class OfferStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    return (await this.collection).findOne({date});
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async save(offerData) {
    return (await this.collection).insertOne(checkData(offerData));
  }

  async saveMany(offerData) {
    return (await this.collection).insertMany(offerData);
  }
}

module.exports = new OfferStore(setupCollection().
  catch((e) => logger.error(`Failed to set up "offers"-collection`, e)));
