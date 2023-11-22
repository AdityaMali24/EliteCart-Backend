import express from 'express'

import { getCategories, addCategory, getCat, updateCat, deleteCat } from '../controllers/category.controller'

const router = express.Router()

router.get('/get-categories',getCategories)
router.post('/add-category',addCategory)
router.get('/get-single-category/:category_id',getCat)
router.put("/update-category/:category_id", updateCat)
router.delete("/delete-category/:category_id", deleteCat);

export default router

