import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import cartModel from "../models/cart.model";

export const getOrders = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const orderData = await orderModel.find({ userID: userID });

    if (orderData) {
      return res.status(200).json({
        data: orderData,
        message: "Cart Items",
        result: orderData.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { userID, cartID } = req.body;

    const cartData = await cartModel.findOne({ _id: cartID });

    const orderData = new orderModel({
      userID: userID,
      productID: cartData.productID,
      price: cartData.price,
      quantity: cartData.quantity,
      thumbnail: cartData.thumbnail,
    });

    orderData.save();
    if (orderData) {
      return res.status(201).json({
        data: orderData,
        message: "Successfully added",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
