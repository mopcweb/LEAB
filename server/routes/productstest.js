import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Config
import * as config from '../config';

// =====> Import model for Product
import ProductModel from '../models/Product';
import TestModel from '../models/Test';

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------- */
/*                      Middlewares
/* ------------------------------------------------------- */

// =====> Use bodyParser
// Define max size of data loaded
router.use(bodyParser.json(config.bp.json));
router.use(bodyParser.urlencoded(config.bp.urlencoded));

/* ------------------------------------------------------- */
/*                         Mongodb
/* ------------------------------------------------------- */

// =====> Connect MongoDb
mongoose.connect(config.MongoURI, config.MongoOpts);

/* ------------------------------------------------------- */
/*                     Product API (CRUD)
/* ------------------------------------------------------- */

// =====> POST
router.post('/:user?', async (req, res) => {
  // Receive whole data obj
  const data = req.body;

  // Receive user param
  const user = req.params.user;

  // If no user provided - send error
  if (user === undefined || user === '') {
    res.send({status: 'No user provided'})

    return
  };

  // Flag for existing title
  let exist = false;

  // Check if there is such item for this user. If it is -> exist = true
  await TestModel
    .findOne({title: user, products: {$elemMatch: {title: data.title}}})
    .then(product => {
      if (product) exist = true;
    })
    .catch(err => res.json({status: err}))

  // Stop running if already exists
  if (exist) return res.send({status: 'already exist'});

  // New product
  const product = {
    title: data.title,
    ccal: data.ccal
    // link: data.link,
    // img: new Buffer(data.img),
    // amount: data.amount,
    // price: data.price,
    // proteins: data.proteins,
    // fats: data.fats,
    // carbs: data.carbs,
    // ccal: data.ccal,
    // unit: data.unit,
    // category: data.category
  };

  // Save product
  TestModel
    .update({title: user}, {$push: {products: product}})
    .then(() => res.send({status: 'ok'}))
    .catch(err => res.send({status: err}))
});

// =====> GET (all or just one by title)
router.get('/:user?', (req, res) => {
  // Receive user param
  const user = req.params.user;

  // If no user provided - send error
  if (user === undefined || user === '') {
    res.send({status: 'No user provided'})

    return
  };

  // Save link (title) param into variable;
  const link = req.query.link !== undefined ? req.query.link : '';

  // Save category query value into variable
  const category = req.query.category;

  // If query by category is set -> find products with its value
  if (category !== undefined) {
    ProductModel
      .find({category: category})
      .then(products => res.send(products))
      .catch(err => res.send({status: err}));

    return;
  };

  // If there is specific title in url -> get this one
  if (link) {
    TestModel
      .findOne({title: user, products: {$elemMatch: {title: link}}})
      .then(product => res.send(product))
      .catch(err => res.json({status: err}));
  } else {
    // Else get all
    TestModel
      .find({title: user})
      .then(user => res.send(user))
      .catch(err => res.send({status: err}));
  };
});

// =====> PUT
router.put('/:id', (req, res) => {
  // Empty obj
  const data = {};

  const test = new TestModel({
    products: product
  })

  // If there are some extra fields
  if (req.body.title) data.title = req.body.title;
  // if (reg.body.products) data.products =

  TestModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(product => {
      if (product) return res.json({status: 'updated'});

      return res.json({status: 'error'});
    })
    .catch(err => res.json({status: err}))
});

// =====> DELETE
router.delete('/:id', (req, res) => {
  const query = req.url.replace(/\//gi, '');

  ProductModel
    .deleteMany(
      query === 'all'
      ? {}
      : {_id: req.params.id}
    )
    .then(product => {
      if (product) return res.json({status: 'product deleted', id: req.params.id});

      return res.json({status: 'error'});
    })
    .catch(err => res.json({status: err}))
});

export default router
