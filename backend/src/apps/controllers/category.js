const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const pagination =  require("../../libs/pagination");
exports.index = async (req, res) => {
    const categories = await CategoryModel.find();
    res.status(200).json({
        status: "success",
        data: {
            docs: categories,
        }

    });
}

exports.catProducts = async (req, res) => { 
    const { id } = req.params;
    await CategoryModel.findById(id)
       .then(category => {
            if (!category) {
                return res.status(404).json({
                    status: "error",
                    message: "Category not found"
                });
            }
        })
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = limit*(page-1);
    const productsCategory = await ProductModel.find({ cat_id: id}).skip(skip).limit(limit);
    res.status(200)
        .json({
            status: "success",
            filter: {
                page,
                limit,
            },
            data: {
                docs: productsCategory,
            },
            pages: await pagination(ProductModel, limit, page, { cat_id: id})
        })
    
}

exports.searchById = async (req, res) => {
    const {id} = req.params;
    const length = await ProductModel.find({cat_id: id}).countDocuments();
    await CategoryModel.findById(id)
    .then(category => {
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        else {
            return res.status(200).json({
                status: "success",
                data: {...category._doc, length}
            });
        }
    })
}