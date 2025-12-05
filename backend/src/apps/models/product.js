const mongoose = require('../../common/database')();

const database = require('../../common/database')();
const productSchema = new database.Schema({
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cat_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },   
    status: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    promotion: {
        type: String,
        required: true,
    },
    warranty: {
        type: String,
        required: true,
    },
    accessories: {
        type: String,
        required: true,
    },
    is_stock: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    

}, {timestamps: true});

const ProductModel = mongoose.model("Products", productSchema, "products")
module.exports = ProductModel;

