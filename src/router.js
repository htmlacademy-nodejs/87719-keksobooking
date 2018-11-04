'use strict';

const express = require(`express`);
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);

const IllegalArgumentError = require(`./errors/illegal-argument-error`);
const NotFoundError = require(`./errors/not-found-error`);
const logger = require(`../logger`);
const ValidationError = require(`./errors/validation-error`);
const validate = require(`./validate`);

const MongoError = require(`mongodb`).MongoError;
const router = new express.Router();
const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});

const PAGE_DEFAULT_LIMIT = 10;

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const toPage = async (cursor, skip = 0, limit = PAGE_DEFAULT_LIMIT) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();
  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count()
  };
};

const ALLOW_CORS = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
};

router.use(ALLOW_CORS);

router.get(``, asyncMiddleware(async (req, res) => {
  const skip = parseInt(req.query.skip || 0, 10);
  const limit = parseInt(req.query.limit || PAGE_DEFAULT_LIMIT, 10);
  if (isNaN(skip) || isNaN(limit)) {
    throw new IllegalArgumentError(`Bad request "skip" or "limit"`);
  }
  res.send(await toPage(await router.offersStore.getAllOffers(), skip, limit));
}));

router.get(`/:date`, asyncMiddleware(async (req, res) => {
  const {date} = req.params;

  if (!date) {
    throw new IllegalArgumentError(`Name is absent in request`);
  }

  const found = await router.offersStore.getOffer(date);
  if (!found) {
    throw new NotFoundError(`Date ${date} not found`);
  }

  res.send(found);
}));

router.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
  const offerDate = req.params.date;
  if (!offerDate) {
    throw new IllegalArgumentError(`Date is missing in request`);
  }

  const date = offerDate;
  const found = await router.offersStore.getOffer(date);

  if (!found) {
    throw new NotFoundError(`Offer with date "${offerDate}" not found`);
  }

  const result = await router.imageStore.get(found._id);
  if (!result) {
    throw new NotFoundError(`Avatar with date "${offerDate}" not found`);
  }

  res.header(`Content-Type`, `image/jpg`);
  res.header(`Content-Length`, result.info.length);

  res.on(`error`, (e) => logger.error(e));
  res.on(`end`, () => res.end());
  const stream = result.stream;
  stream.on(`error`, (e) => logger.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));

router.post(``, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res) => {
  const body = req.body;
  const avatar = req.file;
  if (avatar) {
    body.avatar = avatar.originalname;
  }

  const validated = validate(body);

  const result = await router.offersStore.save(validated);
  const insertedId = result.insertedId;

  if (avatar) {
    await router.imageStore.save(insertedId, toStream(avatar.buffer));
  }

  res.send(validated);
}));

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  logger.error(err);
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
    return;
  } else if (err instanceof MongoError) {
    res.status(400).json(err.message);
    return;
  }
  res.status(err.code || 500).send(err.message);
};

router.use(ERROR_HANDLER);

router.use(NOT_FOUND_HANDLER);

module.exports = (offersStore, imagesStore) => {
  router.offersStore = offersStore;
  router.imageStore = imagesStore;
  return router;
};
