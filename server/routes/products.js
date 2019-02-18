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
  existCode, badReqCode, successCode, existMsg, updateSuccessMsg,
  updateErrorMsg, deleteSuccessMsg, deleteErrorMsg
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
    title, link, img, amount, price, proteins,
    fats, carbs, ccal, unit, category
  } = req.body;

  // Receive userId
  const { userId } = res;

  // Check for this title if it is already exist
  const exist = await ProductModel
    .findOne({ link, userId })
    .then(product => product)
    .catch(err => errorRes(res, badReqCode, err));

  // Stop running if already exists
  if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`);

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
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                                GET
/* ------------------------------------------------------------------- */

router.get('/:link?', (req, res) => {
  // Save title param into variable;
  const { link } = req.params;

  // Get category query value
  const { category } = req.query;

  // Receive userId
  const { userId } = res;

  // If there is specific category & userId -> get product using them
  if (category && userId) {
    return ProductModel
      .find({ category, userId })
      .then(products => res.send(products))
      .catch(err => errorRes(res, badReqCode, err));
  } else if (category) {
    // ===================> SHOULD BE REMOVED LATER
    // Else if there is only category -> get all using it
    return ProductModel
      .find({ category })
      .then(products => res.send(products))
      .catch(err => errorRes(res, badReqCode, err));
  };

  // If there is specific title & userId -> get product using them
  if (link && userId) {
    ProductModel
      .findOne({ link, userId })
      .then(product => res.send(product))
      .catch(err => errorRes(res, badReqCode, err));
  } else if (link) {
    // ===================> SHOULD BE REMOVED LATER
    // Else if there is only link -> get all using it
    ProductModel
      .findOne({ link })
      .then(product => res.send(product))
      .catch(err => errorRes(res, badReqCode, err));
  } else if (userId) {
    // Else if there is only userId -> get all using it
    ProductModel
      .find({ userId })
      .then(products => res.send(products))
      .catch(err => errorRes(res, badReqCode, err));
  } else {
    // Else get all
    ProductModel
      .find()
      .then(products => res.send(products))
      .catch(err => errorRes(res, badReqCode, err));
  };
});

/* ------------------------------------------------------------------- */
/*                                PUT
/* ------------------------------------------------------------------- */

router.put('/:id', async (req, res) => {
  const {
    title, link, img, amount, price,
    proteins, fats, carbs, ccal, unit, category
  } = req.body;

  // Receive id
  const { id } = req.params;

  // Receive userId
  const { userId } = res;

  // Check for this title (link) if it is already exist
  if (link) {
    const exist = await ProductModel
      .findOne({ link, userId })
      .then(product => product._id == id ? null : product)
      .catch(err => errorRes(res, badReqCode, err));

    // Stop running if already exists
    if (exist) return errorRes(res, existCode, `${ existMsg } ${ title }`);
  };

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
  .findOneAndUpdate({_id: id}, {$set: data})
  .then(product => product
    ? successRes(res, successCode, updateSuccessMsg)
    : errorRes(res, badReqCode, updateErrorMsg))
  .catch(err => errorRes(res, badReqCode, err));
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
      ? successRes(res, successCode, deleteSuccessMsg)
      : errorRes(res, badReqCode, deleteErrorMsg))
    .catch(err => errorRes(res, badReqCode, err));
});

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router;
