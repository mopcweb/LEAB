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
  existCode, badReqCode, successCode, forbiddenCode
} = require('../constants').statusCodes;

const {
  existMsg, updateSuccessMsg, updateErrorMsg, deleteSuccessMsg,
  deleteErrorMsg, emailNoChangeMsg, noEmailMsg
} = require('../constants').langs;

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

router.put('/:title', (req, res) => {
  // Receive data
  const body = req.body;

  // Get title
  const { title } = req.params;

  // Get variables
  const { parent, child, prop } = req.query;

  /*
  * @param 'parent' is selector of needed property, where we will search a child for update
  * @param 'child' is a property for update. It's value will be updated with req.body
  * @param 'prop' will be used instead of req.body if specified. Use it for updating
    value of strings (Ex. "test": 123)
  */

  LangModel
    .findOne({ title })
    .distinct(parent)
    .then(lang => {
      // Get first elem (as 'distinct' returns an array)
      const property = lang[0];

      // Create new or change old property
      property[child] = prop ? prop : req.body;

      // Update
      LangModel
        .updateOne({ title }, { $set: { [parent]: property } })
        .then(lang => lang
          ? successRes(res, successCode, updateSuccessMsg)
          : errorRes(res, badReqCode, updateErrorMsg))
        .catch(err => errorRes(res, badReqCode, err));
    });
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
