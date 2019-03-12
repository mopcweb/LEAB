const express = require('express');
const mongoose = require('mongoose');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Import schema for Category
const CategorySchema = require('../models/CategorySchema');

// =====> Create model for products categories
const CategoryModel = mongoose.model('productsCategories', CategorySchema);

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

const {
  existCode, badReqCode, successCode, internalServerErrorCode
} = require('../constants').statusCodes;

const {
  existMsg, updateSuccessMsg, updateErrorMsg, deleteSuccessMsg, deleteErrorMsg
} = require('../constants').categories;

/* ------------------------------------------------------------------- */
/*                               POST
/* ------------------------------------------------------------------- */

router.post('/', async (req, res) => {
  const { title, img } = req.body;

  // Receive userId
  const { userId } = res;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title, userId })
    .then(category => category)
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));

  // Stop running if already exists
  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`, originalUrl, method);

  // Define new category
  const category = new CategoryModel({
    userId,
    title,
    img: img ? new Buffer(img) : ''
  });

  // Save category
  category
    .save()
    .then(user => res.send(user))
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
});

/* ------------------------------------------------------------------- */
/*                               GET
/* ------------------------------------------------------------------- */

router.get('/:title?', (req, res) => {
  // Save title param into variable;
  const { title } = req.params;

  // Receive userId
  const { userId } = res;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // If there is specific title & userId -> get product using them
  if (title && userId) {
    CategoryModel
      .findOne({ title, userId })
      .then(category => res.send(category))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  } else if (title) {
    // ===================> SHOULD BE REMOVED LATER
    // Else if there is only title -> get all using it
    CategoryModel
      .findOne({ title })
      .then(category => res.send(category))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  } else if (userId) {
    // Else if there is only userId -> get all using it
    CategoryModel
      .find({ userId })
      .then(categories => res.send(categories))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  } else {
    // Else get all
    CategoryModel
      .find()
      .then(categories => res.send(categories))
      .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', async (req, res) => {
  const { title, img } = req.body;

  // Receive id
  const { id } = req.params;

  // Receive userId
  const { userId } = res;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title, userId })
    .then(category => category)
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));

  // Stop running if already exists
  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`, originalUrl, method);

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (title) data.title = title;
  if (img) data.img = img;

  CategoryModel
    .findOneAndUpdate({_id: id}, {$set: data})
    .then(category => category
      ? successRes(res, successCode, updateSuccessMsg, originalUrl, method)
      : errorRes(res, badReqCode, updateErrorMsg, originalUrl, method))
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
});

/* ------------------------------------------------------------------- */
/*                               DELETE
/* ------------------------------------------------------------------- */

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Get url & method for error response
  const { originalUrl, method } = req;

  CategoryModel
    .deleteMany(
      id === 'all'
      ? {}
      : {_id: id}
    )
    .then(category => category.deletedCount !== 0
      ? successRes(res, successCode, deleteSuccessMsg, originalUrl, method)
      : errorRes(res, badReqCode, deleteErrorMsg, originalUrl, method))
    .catch(err => errorRes(res, internalServerErrorCode, err, originalUrl, method));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
