const express = require('express');

/* ------------------------------------------------------------------- */
/*                          Import api routes
/* ------------------------------------------------------------------- */

const error = require('./error');
const users = require('./users');
const products = require('./products');
const categories = require('./categories');

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Config
const { api } = require('../config');

const router = express.Router();

/* ------------------------------------------------------------------- */
/*                               Routes
/* ------------------------------------------------------------------- */

const ERROR = api;
const HOME = api + '/';
const LOGIN = api + '/login';
const REGISTER = api + '/register';
const USERS = api + '/users';
const DASHBOARD = api + '/dashboard';
const MENU = api + '/menu';
const DISHES = api + '/dishes';
const DISHES_CATEGORIES = api + '/dishesCategories';
const PRODUCTS = api + '/products';
const PRODUCTS_CATEGORIES = api + '/productsCategories';

/* ------------------------------------------------------------------- */
/*                          Middlewares-routes
/* ------------------------------------------------------------------- */

// =====> Routes
router.use(USERS, users);
router.use(PRODUCTS, products);
router.use(PRODUCTS_CATEGORIES, categories);

// =====> Errors
router.use(ERROR, error);

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = router
