const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Config
const { MongoOpts, MongoURI, bp } = require('../config');

// =====> Import model
const UserModel = require('../models/User');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

const {
  existMsg, existCode, badReqCode, successCode,
  updateSuccessMsg, updateErrorMsg, deleteSuccessMsg,
  deleteErrorMsg, emailNoChangeMsg, forbiddenCode
} = require('../constants').users;

/* ------------------------------------------------------------------- */
/*                             Middlewares
/* ------------------------------------------------------------------- */

// =====> Use bodyParser
// Define max size of data loaded
router.use(bodyParser.json(bp.json));
router.use(bodyParser.urlencoded(bp.urlencoded));

/* ------------------------------------------------------------------- */
/*                               MongoDb
/* ------------------------------------------------------------------- */

// =====> Connect MongoDb
mongoose.connect(MongoURI, MongoOpts);

/* ------------------------------------------------------------------- */
/*                                POST
/* ------------------------------------------------------------------- */

router.post('/', async (req, res) => {
  let { username, email, img, currency } = req.body;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  if (email) email = email.toLowerCase().trim();

  // Check for this username. If it is -> exist = true
  const exist = await UserModel
    .findOne({ email })
    .then(user => user)
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));

  // Stop running if already exists
  if (exist) return res
    .status(existCode)
    .send(errorRes(`${ existMsg } ${ email }`, existCode));

  // New User
  const user = new UserModel({
    username,
    email,
    img: img ? new Buffer(img) : '',
    currency
  });

  // Save user
  user
    .save()
    .then(user => res.send(user))
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
});

/* ------------------------------------------------------------------- */
/*                                GET
/* ------------------------------------------------------------------- */

router.get('/:email?', (req, res) => {
  // Save title param into variable;
  let { email } = req.params;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  if (email) email = email.toLowerCase().trim();

  // Get by email
  if (email) {
    UserModel
      .findOne({ email })
      .then(user => res.send(user))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  } else {
    // Else get all
    UserModel
      .find()
      .then(users => res.send(users))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', (req, res) => {
  // Receive data
  const { email, username, img, currency } = req.body;

  // If there is email specified under PUT request -> send Error
  if (email) return res
    .status(forbiddenCode)
    .send(errorRes(emailNoChangeMsg, forbiddenCode));

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (username) data.username = username;
  if (img) data.img = img;
  if (currency) data.currency = currency;

  // Update user
  UserModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(user => user
      ? res
        .status(successCode)
        .send(successRes(updateSuccessMsg, successCode))
      : res
        .status(badReqCode)
        .send(errorRes(updateErrorMsg, badReqCode)))
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
});

/* ------------------------------------------------------------------- */
/*                               DELETE
/* ------------------------------------------------------------------- */

router.delete('/:id', (req, res) => {
  // Receive param
  const { id } = req.params;

  // Delete user(s)
  UserModel
    .deleteMany(
      id === 'all'
      ? {}
      : {_id: id}
    )
    .then(user => user.deletedCount !== 0
      ? res
        .status(successCode)
        .send(successRes(deleteSuccessMsg, successCode))
      : res
        .status(badReqCode)
        .send(errorRes(deleteErrorMsg, badReqCode)))
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
