const ProductModel = require("../models/product");
const pagination = require("../../libs/pagination");
exports.index = async (req, res) => {
    try {
        const query = {};
        query.is_stock = req.query.is_stock || true;
        query.featured = req.query.featured || false;
        if (req.query.name) query.$text = { $search: req.query.name };
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = limit * (page - 1);
        const products = await ProductModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
        //const products = await ProductModel.find(query);
        res.status(200).json({
            status: "success",
            filter: {
                is_stock: query.is_stock,
                featured: query.featured,
                page,
                limit,
            },
            data: {
                docs: products,
            },
            pages: await pagination(ProductModel, limit, page, query),

        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.show = async (req, res) => {
    try {
        const id = req.params.id
        const product = await ProductModel.findById(id);
        res.status(200).json({
            status: "success",
            data: product,
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}
