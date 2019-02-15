const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Config
const { MongoOpts, MongoURI, bp } = require('../config');

// =====> Import model
const UserModel = require('../models/User');

// =====> Define router
const router = express.Router();

/* ------------------------------------------------------- */
/*                        Constants
/* ------------------------------------------------------- */

const { errorRes, successRes } = require('../constants');

/* ------------------------------------------------------- */
/*                      Middlewares
/* ------------------------------------------------------- */

// =====> Use bodyParser
// Define max size of data loaded
router.use(bodyParser.json(bp.json));
router.use(bodyParser.urlencoded(bp.urlencoded));

/* ------------------------------------------------------- */
/*                         Mongodb
/* ------------------------------------------------------- */

// =====> Connect MongoDb
mongoose.connect(MongoURI, MongoOpts);

/* ------------------------------------------------------- */
/*                        API (CRUD)
/* ------------------------------------------------------- */

// =====> POST
router.post('/', async (req, res) => {
  const { username, email, img, currency } = req.body

  // Flag for existing title
  let exist = false;

  // Check for this username. If it is -> exist = true
  await UserModel
    .findOne({username})
    .then(user => {
      if (user) exist = true;
    })
    .catch(err => res.send(errorRes(err)))

  // Stop running if already exists
  if (exist) return res.send(successRes('Already exist'));

  // New User
  const user = new UserModel({
    username,
    email,
    img: img ? new Buffer(img) : '',
    currency: currency ? currency : ''
  });

  // Save user
  user
    .save()
    .then(user => res.send(user))
    .catch(err => res.send(errorRes(err)))
});

// =====> GET (all or just one by title)
router.get('/:username?', (req, res) => {
  // Save title param into variable;
  const username = req.params.username !== undefined ? req.params.username : '';

  // If there is an email query -> search via email
  const email = req.query.email;

  // if (email !== undefined && email !== '') {
  if (email) {
    UserModel
      .findOne({email})
      .then(user => res.send(user))
      .catch(err => res.send(errorRes(err)))

    return
  };

  // If there is specific title in url -> get this one
  if (username) {
    UserModel
      .findOne({username})
      .then(user => res.send(user))
      .catch(err => res.send(errorRes(err)))
  } else {
    // Else get all
    UserModel
      .find()
      .then(users => res.send(users))
      .catch(err => res.send(errorRes(err)))
  };
});

// =====> PUT
router.put('/:id', (req, res) => {
  // Empty obj
  const data = {};

  // If there are some extra fields
  if (req.body.username) data.username = req.body.username;
  if (req.body.img) data.img = req.body.img;
  if (req.body.currency) data.currency = req.body.currency;

  UserModel
    .findOneAndUpdate({_id: req.params.id}, {$set: data})
    .then(user => {
      if (user) return res.send(user);

      return res.send(errorRes('Error occured'));
    })
    .catch(err => res.send(errorRes(err)))
});

// =====> DELETE
router.delete('/:id', (req, res) => {
  const query = req.url.replace(/\//gi, '');

  UserModel
    .deleteMany(
      query === 'all'
      ? {}
      : {_id: req.params.id}
    )
    .then(user => {
      if (user) return res.send(successRes({status: 'User deleted', id: req.params.id}));

      return res.send(errorRes('Error occured'));
    })
    .catch(err => res.send(errorRes(err)))
});

/* ------------------------------------------------------- */
/*                         Export
/* ------------------------------------------------------- */

module.exports = router;
