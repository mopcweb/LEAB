import express from 'express';

import products from './products';
import categories from './categories';

const router = express.Router();

/* ------------------------------------------------------- */
/*                        Routes
/* ------------------------------------------------------- */

router.use('/products', products);
router.use('/categories', categories);

export default router
