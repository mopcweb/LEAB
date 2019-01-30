import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

// Import model for Category
import CategoryModel from '../../models/Category';

// Define router
const router = express.Router();

// Use bodyParser
// Define max size of data loaded
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Connect MongoDb
mongoose.connect('mongodb://localhost/leab', { useNewUrlParser: true });

/* ------------------------------------------------------- */
/*                     Category API (CRUD)
/* ------------------------------------------------------- */

// =====> POST
router.post('/', async (req, res) => {
  const data = req.body;

  // Flag for existing title
  let exist = false;

  // Check fr this title. If it is -> exist = true
  await CategoryModel
    .findOne({title: data.title})
    .then(category => {
      if (category) exist = true;
    })
    .catch(err => res.json({status: err}))

  // Stop running if already exists
  if (exist) return res.send({status: 'already exist'});

  // New category
  const category = new CategoryModel({
    title: data.title,
    img: new Buffer(data.img)
  });

  // Save category
  category
    .save()
    .then(() => res.json({status: 'added new category', title: data.title}))
    .catch(err => res.send({status: err}))
});

// =====> GET (all or just one by title)
router.get('/:title?', (req, res) => {
  const query = req.url.replace(/\//gi, '');

  // If there is specific title in url -> get this one
  if (query) {
    CategoryModel
      .findOne({title: query})
      .then(category => res.send(category))
      .catch(err => res.json({status: err}));
  } else {
    // Else get all
    CategoryModel
      .find()
      .then(categories => res.send(categories))
      .catch(err => res.json({status: err}));
  };
});

// =====> PUT
router.put('/:id', (req, res) => {
  // Empty obj
  const data = {};

  // If there are some extra fields
  if (req.body.title) data.title = req.body.title;
  if (req.body.img) data.img = req.body.img;

  CategoryModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(category => {
      if (category) return res.json({status: 'updated'});

      return res.json({status: 'error'});
    })
    .catch(err => res.json({status: err}))
});

// =====> DELETE
router.delete('/:id', (req, res) => {
  const query = req.url.replace(/\//gi, '');

  CategoryModel
    .deleteMany(
      query === 'all'
      ? {}
      : {_id: req.params.id}
    )
    .then(category => {
      if (category) return res.json({status: 'category deleted', id: req.params.id});

      return res.json({status: 'error'});
    })
    .catch(err => res.json({status: err}));
});

export default router