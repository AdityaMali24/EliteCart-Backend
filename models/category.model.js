import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    Name: {
        type: String,
        required: null,
    },
    Image: {
        type: String,
        required: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Category", CategorySchema);
