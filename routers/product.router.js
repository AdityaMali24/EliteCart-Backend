import express from 'express'

import { getProducts, addProduct, updateProduct , deleteProduct, getProduct} from '../controllers/product.controller'

const router = express.Router();

import auth from '../middleware/auth.middleware';

router.get('/get-products', getProducts)
router.get('/get-single-products/:product_id', getProduct)
router.post('/add-products', addProduct)
router.put('/update-products/:product_id', updateProduct)
router.delete('/delete-products/:product_id', deleteProduct)

export default router