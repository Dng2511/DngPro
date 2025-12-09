const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const pagination = require("../../libs/pagination");
exports.index = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json({
            status: "success",
            data: {
                docs: categories,
            }

        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.catProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = limit * (page - 1);
        const [productsCategory, paginationData] = await Promise.all([
            ProductModel.find({ cat_id: id }).skip(skip).limit(limit),
            pagination(ProductModel, limit, page, { cat_id: id })
        ]);

        res.status(200).json({
            status: "success",
            filter: { page, limit },
            data: { docs: productsCategory },
            pages: paginationData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }

}

exports.searchById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id).lean();

        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        const length = await ProductModel.countDocuments({ cat_id: id });
        res.status(200).json({
            status: "success",
            data: { ...category, length }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
