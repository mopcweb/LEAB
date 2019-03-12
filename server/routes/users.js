const express = require('express');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Import model
const UserModel = require('../models/User');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

const {
  existCode, badReqCode, successCode, forbiddenCode, internalServerErrorCode
} = require('../constants').statusCodes;

const {
  existMsg, updateSuccessMsg, updateErrorMsg, deleteSuccessMsg,
  deleteErrorMsg, emailNoChangeMsg, noEmailMsg
} = require('../constants').users;

/* ------------------------------------------------------------------- */
/*                                POST
/* ------------------------------------------------------------------- */

router.post('/', async (req, res) => {
  let { username, email, img, currency, standart, big, lang } = req.body;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  // If there is no email -> send error
  if (email) email = email.toLowerCase().trim()
  else errorRes(res, badReqCode, noEmailMsg, originalUrl, method);

  // Check for this username. If it is -> exist = true
  const exist = await UserModel
    .findOne({ email })
    .then(user => user)
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));

  if (exist) return errorRes(res, existCode, `${ existMsg } ${ email }`, originalUrl, method);

  // New User
  const user = new UserModel({
    username,
    email,
    img: img ? new Buffer(img) : '',
    currency,
    standart,
    big,
    lang
  });

  // Save user
  user
    .save()
    .then(user => res.send(user))
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
});

/* ------------------------------------------------------------------- */
/*                                GET
/* ------------------------------------------------------------------- */

router.get('/:email?', (req, res) => {
  // Save title param into variable;
  let { email } = req.params;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  if (email) email = email.toLowerCase().trim();

  // Get url & method for error response
  const { originalUrl, method } = req;

  // Get by email
  if (email) {
    UserModel
      .findOne({ email })
      .then(user => res.send(user))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  } else {
    // Else get all
    UserModel
      .find()
      .then(users => res.send(users))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', (req, res) => {
  // Receive data
  const { email, username, img, currency, standart, big, lang } = req.body;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // If there is email specified under PUT request -> send Error
  if (email) return res
    .status(forbiddenCode)
    .send(errorRes(emailNoChangeMsg, forbiddenCode, originalUrl, method));

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (username) data.username = username;
  if (img) data.img = img;
  if (currency) data.currency = currency;
  if (standart) data.standart = standart;
  if (big) data.big = big;
  if (lang) data.lang = lang;

  // Update user
  UserModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(user => user
      ? successRes(res, successCode, updateSuccessMsg, originalUrl, method)
      : errorRes(res, badReqCode, updateErrorMsg, originalUrl, method))
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
});

/* ------------------------------------------------------------------- */
/*                               DELETE
/* ------------------------------------------------------------------- */

// router.delete('/:id', (req, res) => {
//   // Receive param
//   const { id } = req.params;
//
//   // Get url & method for error response
//   const { originalUrl, method } = req;
//
//   // Delete user(s)
//   UserModel
//     .deleteMany(
//       id === 'all'
//       ? {}
//       : {_id: id}
//     )
//     .then(user => user.deletedCount !== 0
//       ? successRes(res, successCode, deleteSuccessMsg, originalUrl, method)
//       : errorRes(res, badReqCode, deleteErrorMsg, originalUrl, method))
//     .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
// });

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
