const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Config
const { MongoOpts, MongoURI, bp } = require('../config');

// =====> Import model for Category
const CategoryModel = require('../models/Category');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

const {
  existMsg, existCode, badReqCode, successCode,
  updateSuccessMsg, updateErrorMsg, deleteSuccessMsg,
  deleteErrorMsg, userIdNoChangeMsg, forbiddenCode
} = require('../constants').categories;

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
/*                               POST
/* ------------------------------------------------------------------- */

// =====> POST
router.post('/', async (req, res) => {
  let { userId, title, img } = req.body;

  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  if (userId) userId = userId.toLowerCase().trim();

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title })
    .then(category => category)
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));

  // Stop running if already exists
  if (exist) return res
    .status(existCode)
    .send(errorRes(`${ existMsg } ${ title }`, existCode));

  // New category
  const category = new CategoryModel({
    userId,
    title,
    img: img ? new Buffer(img) : ''
  });

  // Save category
  category
    .save()
    .then(user => res.send(user))
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
});

/* ------------------------------------------------------------------- */
/*                               GET
/* ------------------------------------------------------------------- */

router.get('/:title?', (req, res) => {
  // Save title param into variable;
  const { title } = req.params;

  // Save userId query values into variables
  let { userId } = req.query;

  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  if (userId) userId = userId.toLowerCase().trim();

  // If there is specific title & userId -> get product using them
  if (title && userId) {
    CategoryModel
      .findOne({ title, userId })
      .then(category => res.send(category))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  } else if (userId) {
    // Else if there is only userId -> get all using it
    CategoryModel
      .find({ userId })
      .then(categories => res.send(categories))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  } else {
    // Else get all
    CategoryModel
      .find()
      .then(categories => res.send(categories))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', async (req, res) => {
  const { userId, title, img } = req.body;

  // If there is userId specified under PUT request -> send Error
  if (userId) return res
    .status(forbiddenCode)
    .send(errorRes(userIdNoChangeMsg, forbiddenCode));

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (title) data.title = title;
  if (img) data.img = img;

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title })
    .then(category => category)
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));

  // Stop running if already exists
  if (exist) return res
    .status(existCode)
    .send(errorRes(`${ existMsg } ${ title }`, existCode));

  CategoryModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(category => category
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
  const { id } = req.params;

  CategoryModel
    .deleteMany(
      id === 'all'
      ? {}
      : {_id: id}
    )
    .then(category => category.deletedCount !== 0
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
