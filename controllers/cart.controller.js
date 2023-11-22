import cartModel from "../models/cart.model";
import productModel from "../models/product.model";

export const getCartItems = async (req, res) => {
  try {
    // const userID = req.params.user_id;
    const cartData = await cartModel.find();
    if (cartData) {
      return res.status(200).json({
        data: cartData,
        message: "Cart Items",
        result: cartData.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addCartItems = async (req, res) => {
  try {
    // const { userID } = req.body;
    const productID = req.params.product_id;
    const productData = await productModel.findOne({ _id: productID });

    const existCartItem = await cartModel.findOne({
      productID: productID
    });
    if (existCartItem) {
      let quantity = existCartItem.quantity + 1;
      let price = productData.price * quantity;
      console.log(quantity, "quan");

      const updatedItem = await cartModel.updateOne(
        { _id: existCartItem._id },
        {
          $set: {
            quantity: quantity,
            price: price,
          },
        }
      );
      if (updatedItem.acknowledged) {
        return res.status(200).json({
          data: updatedItem,
          message: "updated",
        });
      }
    }

    const cartData = new cartModel({
      productID: productID,
      Name: productData.Name,
      price: productData.price,
      quantity: 1,
      thumbnail: productData.thumbnail,
    });
    cartData.save();
    if (cartData) {
      return res.status(201).json({
        data: cartData,
        message: "Product Successfully added to Cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const { productID } = req.body;
    const { updatetype } = req.query;

    const cartData = await cartModel.findOne({ _id: cartID });
    const productData = await productModel.findOne({ _id: productID });

    let quantity = cartData.quantity;
    let subtotal = cartData.price;

    if (updatetype === "increment") {
      quantity += 1;
      subtotal = subtotal * quantity;
    }
    if (updatetype === "decrement") {
      quantity -= 1;
      subtotal = subtotal * quantity;
    }
    const updatedQuantity = await cartModel.updateOne(
      { _id: cartID },
      {
        $set: {
          quantity: quantity,
          subtotal: subtotal,
        },
      }
    );
    if (updatedQuantity.acknowledged) {
      return res.status(200).json({
        message: "Updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartID = req.params.cart_id;

    const deletedItem = await cartModel.deleteOne({ _id: cartID})
    if(deletedItem.acknowledged) {
      return res.status(200).json({
        data: deletedItem,
        message:"Cart Item Deleted Successfully",
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
