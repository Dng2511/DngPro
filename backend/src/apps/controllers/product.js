const ProductModel = require("../models/product");
const CommentModel = require("../models/comment");
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

// Comment functions


exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = limit * (page - 1);
        const comments = await CommentModel.find({ prd_id: id }).sort({ _id: -1 }).skip(skip).limit(limit);
        const total = await CommentModel.countDocuments({ prd_id: id });
        const pages = Math.ceil(total / limit);
        res.status(200).json({
            status: "success",
            data: { docs: comments },
            pages: {
                total,
                pages,
                page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.postComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, full_name, email } = req.body;
        if (!body || !full_name || !email) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }
        const newComment = new CommentModel({
            prd_id: id,
            body,
            name: full_name,
            email,
        });
        await newComment.save();
        res.status(201).json({
            status: "success",
            data: newComment,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
