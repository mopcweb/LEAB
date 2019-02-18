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

// =====> Import constants
const { response } = require('../constants').error;

// =====> Constants
const { errorRes } = require('../constants');

const { errorMsg, notFoundCode } = require('../constants').error;

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
  errorRes(res, notFoundCode, errorMsg);
});

// =====> POST
router.post('/*', (req, res) => {
  errorRes(res, notFoundCode, errorMsg);
});

// =====> PUT
router.put('/*', (req, res) => {
  errorRes(res, notFoundCode, errorMsg);
});

// =====> DELETE
router.delete('/*', (req, res) => {
  errorRes(res, notFoundCode, errorMsg);
});


/* ------------------------------------------------------------------- */
/*                                 Export
/* ------------------------------------------------------------------- */

module.exports = router;
