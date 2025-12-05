const ProductModel = require("../models/product");
const pagination =  require("../../libs/pagination");
exports.index = async (req, res) => {
    const query = {};
    query.is_stock = req.query.is_stock || true;
    query.is_featured = req.query.featured || false;
    if(req.query.name) query.$text = { $search: req.query.name };
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = limit*(page-1);
    const products = await ProductModel.find(query)
    .sort({_id: -1})
    .skip(skip)
    .limit(limit);
    res
    .status(200)
    .json({
        status: "success",
        filter: {
            is_stock: query.is_stock,
            is_featured: query.is_featured,
            page,
            limit,
        },
        data: {
            docs: products,
        },
        pages: await pagination(ProductModel, limit, page, query),

    })
}

exports.show = async (req, res) => {
    const id = req.params.id
    const product = await ProductModel.findById(id);
    res.status(200).json({
        status: "success",
        data: product,
    })
}
