const express = require('express');
const bodyParser = require('body-parser');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

// =====> Constants
const { errorRes } = require('../constants');

const { errorMsg } = require('../constants').error;

const { notFoundCode } = require('../constants').statusCodes;

/* ------------------------------------------------------------------- */
/*                             Middlewares
/* ------------------------------------------------------------------- */

// =====> Use bosy-parser (json + urlencoded)
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* ------------------------------------------------------------------- */
/*                                 Api
/* ------------------------------------------------------------------- */

// =====> GET
router.get('/*', (req, res) => {
  // Get url & method for error response
  const { originalUrl, method } = req;

  // Send response
  errorRes(res, notFoundCode, errorMsg, originalUrl, method);
});

// =====> POST
router.post('/*', (req, res) => {
  // Get url & method for error response
  const { originalUrl, method } = req;

  // Send response
  errorRes(res, notFoundCode, errorMsg, originalUrl, method);
});

// =====> PUT
router.put('/*', (req, res) => {
  // Get url & method for error response
  const { originalUrl, method } = req;

  // Send response
  errorRes(res, notFoundCode, errorMsg, originalUrl, method);
});

// =====> DELETE
router.delete('/*', (req, res) => {
  // Get url & method for error response
  const { originalUrl, method } = req;

  // Send response
  errorRes(res, notFoundCode, errorMsg, originalUrl, method);
});


/* ------------------------------------------------------------------- */
/*                                 Export
/* ------------------------------------------------------------------- */

module.exports = router;
