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
  deleteErrorMsg, emailNoChangeMsg, forbiddenCode, noEmailMsg
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
  let { username, email, img, currency, standart, big } = req.body;

  console.log(res.userId)

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  // If there is no email -> send error
  if (email) email = email.toLowerCase().trim()
  else errorRes(res, badReqCode, noEmailMsg);

  // Check for this username. If it is -> exist = true
  const exist = await UserModel
    .findOne({ email })
    .then(user => user)
    .catch(err => errorRes(res, badReqCode, err));

  if (exist) return errorRes(res, existCode, `${ existMsg } ${ email }`);

  // New User
  const user = new UserModel({
    username,
    email,
    img: img ? new Buffer(img) : '',
    currency,
    standart,
    big
  });

  // Save user
  user
    .save()
    .then(user => res.send(user))
    .catch(err => errorRes(res, badReqCode, err));
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
      .catch(err => errorRes(res, badReqCode, err));
  } else {
    // Else get all
    UserModel
      .find()
      .then(users => res.send(users))
      .catch(err => errorRes(res, badReqCode, err));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', (req, res) => {
  // Receive data
  const { email, username, img, currency, standart, big } = req.body;

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
  if (standart) data.standart = standart;
  if (big) data.big = big;

  // Update user
  UserModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(user => user
      ? successRes(res, successCode, updateSuccessMsg)
      : errorRes(res, badReqCode, updateErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
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
      ? successRes(res, successCode, deleteSuccessMsg)
      : errorRes(res, badReqCode, deleteErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
