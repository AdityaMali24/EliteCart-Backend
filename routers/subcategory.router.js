import express from 'express'

import { getsubcategory, getSingleSubCategory, addsubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subcategory.controller'

const router = express.Router()

router.get('/get-sub-category',getsubcategory )
router.get('/get-single-sub-category/:subcategory_id',getSingleSubCategory )
router.post('/add-category',addsubCategory)
router.put('/update-sub-category/:subcategory_id',updateSubCategory )
router.delete('/delete-sub-category/:subcategory_id', deleteSubCategory )


export default router
