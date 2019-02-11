import express from 'express';

/* ------------------------------------------------------- */
/*                     Import Models
/* ------------------------------------------------------- */

import products from './products';
import categories from './categories';
import test from './test';
import productstest from './productstest';

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Config
import * as config from '../config';

const router = express.Router();

/* ------------------------------------------------------- */
/*                         Routes
/* ------------------------------------------------------- */

router.use(config.PRODUCTS, products);
router.use(config.PRODUCTS_CATEGORIES, categories);
router.use('/api/test', test);
router.use('/api/test/products', productstest);

export default router
