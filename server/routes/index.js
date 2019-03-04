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

const { errorRes } = require('../constants');

const { noUserIdMsg } = require('../constants').general;

const { badReqCode } = require('../constants').statusCodes;

/* ------------------------------------------------------------------- */
/*                               MongoDb
/* ------------------------------------------------------------------- */

// =====> Connect MongoDb
mongoose.connect(MongoURI, MongoOpts);

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

// =====> Langs
router.use(routes.LANGS, lang);

// =====> Errors
router.use(routes.ERROR, error);

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router
