const express = require('express');

/* ------------------------------------------------------------------- */
/*                          Import api routes
/* ------------------------------------------------------------------- */

const error = require('./error');
const users = require('./users');
const products = require('./products');
const categories = require('./categories');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Api & Routes
const { api, routes } = require('../config');

// =====> Constants
const { errorRes } = require('../constants');

const { noUserIdMsg, badReqCode } = require('../constants').general;

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                             Middleware
/* ------------------------------------------------------------------- */

// =====> Provide userId
const provideUserId = (req, res, next) => {
  // Get userId header
  const { userid } = req.headers;

  // Save into res.variable
  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  // If there is no userId -> send error
  if (userid) res.userId = userid.toLowerCase().trim()
  else return errorRes(res, badReqCode, noUserIdMsg);

  // Path results further
  return next();
};

/* ------------------------------------------------------------------- */
/*                               Routes
/* ------------------------------------------------------------------- */

// =====> General
router.use(routes.USERS, users);
router.use(routes.PRODUCTS, provideUserId, products);
router.use(routes.PRODUCTS_CATEGORIES, provideUserId, categories);

// =====> Errors
router.use(routes.ERROR, error);

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router
