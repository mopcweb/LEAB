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
  res.status(404);
  res.send(response);
});

// =====> POST
router.post('/*', (req, res) => {
  res.status(404);
  res.send(response);
});

// =====> PUT
router.put('/*', (req, res) => {
  res.status(404);
  res.send(response);
});

// =====> DELETE
router.delete('/*', (req, res) => {
  res.status(404);
  res.send(response);
});


/* ------------------------------------------------------------------- */
/*                                 Export
/* ------------------------------------------------------------------- */

module.exports = router;
