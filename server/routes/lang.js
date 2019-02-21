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

router.put('/:title', async (req, res) => {
  // Receive data
  const body = req.body;

  // Get title
  const { title } = req.params;

  const param = Object.keys(req.query)[0];

  console.log(param)

  let lang = await LangModel
    .findOne({ title })
    // .select({[param]: 1, '_id': 0})
    .distinct(param)
    .then(lang => {
      lang.lala = 'asd';
      lang.save()
    })
    .catch(err => res.send(err))

  // // const test = lang
  // lang.lala = 'asd';
  // console.log(lang)
  //
  // // res.send(lang)
  //
  // LangModel
  //   .save()

  // return res.send('ok')

  // Get field to modify/add
  // const { field, property } = req.query;

  // Stop running if no field
  // if (!field) errorRes(res, badReqCode, updateErrorMsg)

  // Get constants field
  // await LangModel
  //   .findOne({ title })
  //   .select('constants')
  //   .then(async lang => {
  //     // Get constants variable from lang
  //     const { constants } = lang;
  //
  //     await LangModel
  //       .findOne({ title })
  //       .select(constants[field])
  //       .then(res => console.log(res))
  //       .catch(err => err)
  //
  //     res.send('ok')
  //     // if (property) {
  //     //   await LangModel
  //     //     .
  //     // }
  //
  //     // Add new field
  //     // constants[field] = body;
  //
  //     // Update lang
  //     // await LangModel
  //     //   .updateOne({ title }, { $set: { "constants": constants } })
  //     //   .then(lang => lang
  //     //     ? successRes(res, successCode, updateSuccessMsg)
  //     //     : errorRes(res, badReqCode, updateErrorMsg))
  //     //   .catch(err => errorRes(res, badReqCode, err));
  //   })
  //   .catch(err => errorRes(res, badReqCode, err));
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
