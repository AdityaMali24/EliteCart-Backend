import express from "express";

import { getCartItems, addCartItems, updateQuantity, deleteCartItem } from "../controllers/cart.controller";

const router = express.Router();

router.get("/get-cart-items", getCartItems)
router.post("/add-cart-items/:product_id", addCartItems)
router.patch("/update-quantity/:cart_id", updateQuantity)
router.delete("/delete-cart-items/:cart_id", deleteCartItem)

export default router;

