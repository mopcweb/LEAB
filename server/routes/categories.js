const express = require('express');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Import model for Category
const CategoryModel = require('../models/Category');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

const {
  existCode, badReqCode, successCode, existMsg, updateSuccessMsg,
  updateErrorMsg, deleteSuccessMsg, deleteErrorMsg
} = require('../constants').categories;

/* ------------------------------------------------------------------- */
/*                               POST
/* ------------------------------------------------------------------- */

router.post('/', async (req, res) => {
  const { title, img } = req.body;

  // Receive userId
  const { userId } = res;

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title, userId })
    .then(category => category)
    .catch(err => errorRes(res, badReqCode, err));

  // Stop running if already exists
  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`);

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
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                               GET
/* ------------------------------------------------------------------- */

router.get('/:title?', (req, res) => {
  // Save title param into variable;
  const { title } = req.params;

  // Receive userId
  const { userId } = res;

  // If there is specific title & userId -> get product using them
  if (title && userId) {
    CategoryModel
      .findOne({ title, userId })
      .then(category => res.send(category))
      .catch(err => errorRes(res, badReqCode, err));
  } else if (title) {
    // ===================> SHOULD BE REMOVED LATER
    // Else if there is only title -> get all using it
    CategoryModel
      .findOne({ title })
      .then(category => res.send(category))
      .catch(err => errorRes(res, badReqCode, err));
  } else if (userId) {
    // Else if there is only userId -> get all using it
    CategoryModel
      .find({ userId })
      .then(categories => res.send(categories))
      .catch(err => errorRes(res, badReqCode, err));
  } else {
    // Else get all
    CategoryModel
      .find()
      .then(categories => res.send(categories))
      .catch(err => errorRes(res, badReqCode, err));
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

  // Check for this title if it is already exist
  const exist = await CategoryModel
    .findOne({ title, userId })
    .then(category => category)
    .catch(err => errorRes(res, badReqCode, err));

  // Stop running if already exists
  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`);

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (title) data.title = title;
  if (img) data.img = img;

  CategoryModel
    .findOneAndUpdate({_id: id}, {$set: data})
    .then(category => category
      ? successRes(res, successCode, updateSuccessMsg)
      : errorRes(res, badReqCode, updateErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
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
      ? successRes(res, successCode, deleteSuccessMsg)
      : errorRes(res, badReqCode, deleteErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
