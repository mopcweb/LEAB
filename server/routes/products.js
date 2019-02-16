const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Config
const { MongoOpts, MongoURI, bp } = require('../config');

// =====> Import model for Product
const ProductModel = require('../models/Product');

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
} = require('../constants').products;

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

router.post('/', async (req, res) => {
  let {
    userId, title, link, img, amount, price,
    proteins, fats, carbs, ccal, unit, category
  } = req.body;

  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  if (userId) userId = userId.toLowerCase().trim();

  // Check for this title if it is already exist
  const exist = await ProductModel
    .findOne({ link })
    .then(product => product)
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));

  // Stop running if already exists
  if (exist) return res
    .status(existCode)
    .send(errorRes(`${ existMsg } ${ title }`, existCode));

  // New product
  const product = new ProductModel({
    userId,
    title,
    link,
    img: img ? new Buffer(img) : '',
    amount,
    price,
    proteins,
    fats,
    carbs,
    ccal,
    unit,
    category,
  });

  // Save product
  product
    .save()
    .then(user => res.send(user))
    .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
});

/* ------------------------------------------------------------------- */
/*                                GET
/* ------------------------------------------------------------------- */

router.get('/:link?', (req, res) => {
  // Save title param into variable;
  const { link } = req.params;

  // Save category & userId query values into variables
  let { userId, category } = req.query;

  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  if (userId) userId = userId.toLowerCase().trim();

  // If query by category is set -> find products with its value
  if (category && userId) {
    return ProductModel
      .find({ category, userId })
      .then(products => res.send(products))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  };

  // If there is specific title & userId -> get product using them
  if (link && userId) {
    ProductModel
      .findOne({ link, userId })
      .then(product => res.send(product))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  } else if (userId) {
    // Else if there is only userId -> get all using it
    ProductModel
      .find({ userId })
      .then(products => res.send(products))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  } else {
    // Else get all
    ProductModel
      .find()
      .then(products => res.send(products))
      .catch(err => res.status(badReqCode).send(errorRes(err, badReqCode)));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', (req, res) => {
  const {
    userId, title, link, img, amount, price,
    proteins, fats, carbs, ccal, unit, category
  } = req.body;

  // If there is userId specified under PUT request -> send Error
  if (userId) return res
    .status(forbiddenCode)
    .send(errorRes(userIdNoChangeMsg, forbiddenCode));

  // Empty obj
  const data = {};

  // If there are some extra fields
  if (title) data.title = title;
  if (link) data.link = link;
  if (img) data.img = img;
  if (amount) data.amount = amount;
  if (price) data.price = price;
  if (proteins) data.proteins = proteins;
  if (fats) data.fats = fats;
  if (carbs) data.carbs = carbs;
  if (ccal) data.ccal = ccal;
  if (unit) data.unit = unit;
  if (category) data.category = category;

  // Update product
  ProductModel
  .findOneAndUpdate({_id: req.params.id}, {$set: data})
  .then(product => product
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

  ProductModel
    .deleteMany(
      id === 'all'
      ? {}
      : {_id: id}
    )
    .then(product => product.deletedCount !== 0
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
