import express from 'express';

/* ------------------------------------------------------- */
/*                     Import Models
/* ------------------------------------------------------- */

import products from './products';
import categories from './categories';

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

export default router
