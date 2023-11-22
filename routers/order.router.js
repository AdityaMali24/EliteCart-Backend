import express from "express";

import { getOrders, addOrder } from "../controllers/order.controller";

const router = express.Router();

router.get("/get-orders/:user_id", getOrders)
router.post("/add-orders", addOrder)

export default router;
