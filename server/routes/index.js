import express from 'express';

/* ------------------------------------------------------- */
/*                        Import Models
/* ------------------------------------------------------- */

import products from './products';
import categories from './categories';

/* ------------------------------------------------------- */
/*                        Config
/* ------------------------------------------------------- */

const router = express.Router();

const api = '/api';

const HOME = api + '/';
const LOGIN = api + '/login';
const PROFILE = api + '/profile';
const DASHBOARD = api + '/dashboard';
const MENU = api + '/menu';
const DISHES = api + '/dishes';
const DISHES_CATEGORIES = api + '/dishesCategories';
const PRODUCTS = api + '/products';
const PRODUCTS_CATEGORIES = api + '/productsCategories';

/* ------------------------------------------------------- */
/*                        Routes
/* ------------------------------------------------------- */

router.use(PRODUCTS, products);
router.use(PRODUCTS_CATEGORIES, categories);

export default router
