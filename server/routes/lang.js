const express = require('express');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Import model
const LangModel = require('../models/Lang');

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
/*                                POST
/* ------------------------------------------------------------------- */

router.post('/', async (req, res) => {
  let { title, constants } = req.body;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  // If there is no email -> send error
  if (title) title = title.toLowerCase().trim()
  else errorRes(res, badReqCode, noEmailMsg);

  // Check for this username. If it is -> exist = true
  const exist = await LangModel
    .findOne({ title })
    .then(lang => lang)
    .catch(err => errorRes(res, badReqCode, err));

  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`);

  // New User
  const lang = new LangModel({
    title,
    constants
  });

  // Save user
  lang
    .save()
    .then(lang => res.send(lang))
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                                GET
/* ------------------------------------------------------------------- */

router.get('/:title?', (req, res) => {
  // Save title param into variable;
  let { title } = req.params;

  // LowerCase & trim() email -> to prevent errors and duplicate emails
  if (title) title = title.toLowerCase().trim();

  // Get by email
  if (title) {
    LangModel
      .findOne({ title })
      .then(user => res.send(user))
      .catch(err => errorRes(res, badReqCode, err));
  } else {
    // Else get all
    LangModel
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
  LangModel
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
  LangModel
    .deleteMany(
      id === 'all'
      ? {}
      : {_id: id}
    )
    .then(lang => lang.deletedCount !== 0
      ? successRes(res, successCode, deleteSuccessMsg)
      : errorRes(res, badReqCode, deleteErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
