import mongoose from "mongoose";
import categoryModel from "./category.model";
import subcategoryModel from "./subcategory.model";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    Name:{
        type:String,
        required:null
    },
    category:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: categoryModel,
    },
    subcategory:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: subcategoryModel,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shortdescription:{
        type:String,
        required:null
    },
    description: {
        type: String,
        default: null,
        maxLength: 1000,
    },
    thumbnail:{
        type:String,
        default:null
    },
    Images:{
        type:[String],
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
});

export default mongoose.model('Product', ProductSchema)


