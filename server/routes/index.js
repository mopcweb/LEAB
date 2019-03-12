const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* ------------------------------------------------------------------- */
/*                          Import api routes
/* ------------------------------------------------------------------- */

const error = require('./error');
const lang = require('./lang');

const users = require('./users');
const products = require('./products');
const productsCategories = require('./productsCategories');
const dishesCategories = require('./dishesCategories');

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Api & Routes
const { api, routes, MongoOpts, MongoURI, bp  } = require('../config');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

const { errorRes, statusCodes, mongo } = require('../constants');

const { noUserIdMsg } = require('../constants').general;

/* ------------------------------------------------------------------- */
/*                               MongoDb
/* ------------------------------------------------------------------- */

// =====> Connect MongoDB
router.use('/', (req, res, next) => {
  // If connection already open -> proceed next()
  if (mongoose.connection.readyState !== 0) return next();

  // Connect to MongoDb and proceed further
  // If connection error -> send response
  if (mongoose.connection.readyState === 0) mongoose.connect(MongoURI, MongoOpts)
    .catch(err => errorRes(res, statusCodes.internalServerErrorCode, mongo.connectionErrMsg, req.originalUrl, req.method));

  if (!res.headersSent) next();
});

/* ------------------------------------------------------------------- */
/*                             Middleware
/* ------------------------------------------------------------------- */

// =====> Use bodyParser
router.use(bodyParser.json(bp.json));
router.use(bodyParser.urlencoded(bp.urlencoded));

// =====> Import middlewares
const { checkToken, checkUserId } = require('../middlewares');

/* ------------------------------------------------------------------- */
/*                               Routes
/* ------------------------------------------------------------------- */

// =====> General
router.use(routes.USERS, checkToken, users);
router.use(routes.PRODUCTS, checkToken, checkUserId, products);
router.use(routes.PRODUCTS_CATEGORIES, checkToken, checkUserId, productsCategories);
router.use(routes.DISHES_CATEGORIES, checkToken, checkUserId, dishesCategories);

// =====> Langs
router.use(routes.LANGS, lang);

// =====> Errors
router.use(routes.ERROR, error);

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router
