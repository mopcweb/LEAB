import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

// Import model for Product
import ProductModel from '../../models/Product';

// Define router
const router = express.Router();

// Use bodyParser
// Define max size of data loaded
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Connect MongoDb
mongoose.connect('mongodb://localhost/leab', { useNewUrlParser: true, useFindAndModify: false });

/* ------------------------------------------------------- */
/*                     Product API (CRUD)
/* ------------------------------------------------------- */

// =====> POST
router.post('/', async (req, res) => {
  const data = req.body;

  // Flag for existing title
  let exist = false;

  // Check fr this title. If it is -> exist = true
  await ProductModel
    .findOne({title: data.title})
    .then(product => {
      if (product) exist = true;
    })
    .catch(err => res.json({status: err}))

  // Stop running if already exists
  if (exist) return res.send({status: 'already exist'});

  // New product
  const product = new ProductModel({
    title: data.title,
    link: data.link,
    img: new Buffer(data.img),
    amount: data.amount,
    price: data.price,
    proteins: data.proteins,
    fats: data.fats,
    carbs: data.carbs,
    ccal: data.ccal,
    unit: data.unit,
    category: data.category
  });

  // Save product
  product
    .save()
    .then(() => res.json({status: 'ok'}))
    .catch(err => res.send({status: err}))
});

// =====> GET (all or just one by title)
router.get('/:link?', (req, res) => {
  // Save title param into variable;
  const link = req.params.link !== undefined ? req.params.link : '';

  // Save category query value into variable
  const category = req.query.category;

  // If query by category is set -> find products with its value
  if (category !== undefined) {
    ProductModel
      .find({category: category})
      .then(products => res.send(products))
      .catch(err => res.json({status: err}));

    return;
  };

  // If there is specific title in url -> get this one
  if (link) {
    ProductModel
      .findOne({link: link})
      .then(product => res.send(product))
      .catch(err => res.json({status: err}));
  } else {
    // Else get all
    ProductModel
      .find()
      .then(products => res.send(products))
      .catch(err => res.json({status: err}));
  };
});

// =====> PUT
router.put('/:id', (req, res) => {
  // Empty obj
  const data = {};

  // If there are some extra fields
  if (req.body.title) data.title = req.body.title;
  if (req.body.link) data.link = req.body.link;
  if (req.body.img) data.img = req.body.img;
  if (req.body.amount) data.amount = req.body.amount;
  if (req.body.price) data.price = req.body.price;
  if (req.body.proteins) data.proteins = req.body.proteins;
  if (req.body.fats) data.fats = req.body.fats;
  if (req.body.carbs) data.carbs = req.body.carbs;
  if (req.body.ccal) data.ccal = req.body.ccal;
  if (req.body.unit) data.unit = req.body.unit;
  if (req.body.category) data.category = req.body.category;

  ProductModel
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
