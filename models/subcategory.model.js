import mongoose from "mongoose";
import categoryModel from "./category.model";

const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    Name:{
        type:String,
        required:null,
    },
    category:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: categoryModel,
    },
    categoryName:{

    },
    Image:{
        type:String,
        default:null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
      },
});

export default mongoose.model('Sub-Category',SubCategorySchema)
