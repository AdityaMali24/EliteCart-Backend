import mongoose from "mongoose";


const Schema = mongoose.Schema;

const CartSchema = new Schema({
    // userID: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
    productID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: null,
    },
    thumbnail: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });


  export default mongoose.model("Cart", CartSchema);
