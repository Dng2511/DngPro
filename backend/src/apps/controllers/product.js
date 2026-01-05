const ProductModel = require("../models/product");
const CommentModel = require("../models/comment");
const pagination = require("../../libs/pagination");
exports.index = async (req, res) => {
    try {
        const query = {};
        if (req.query.is_stock) query.is_stock = req.query.is_stock;
        if (req.query.featured) query.featured = req.query.featured;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = limit * (page - 1);
        let products;

        if (req.query.name) {
            query.$text = { $search: req.query.name };
            products = await ProductModel.find(query, {
                score: { $meta: "textScore" }
            })
                .sort({ score: { $meta: "textScore" } })
                .limit(limit)
                .skip(skip);
        } else {
            products = await ProductModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
        }
        //const products = await ProductModel.find(query);
        res.status(200).json({
            status: "success",
            filter: {
                is_stock: query.is_stock || undefined,
                featured: query.featured || undefined,
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

exports.create = async (req, res) => {
    try {
        const { name, price, description, status, cat_id, featured, is_stock, accessories, warranty, promotion } = req.body;
        const thumbnail = req.file ? req.file.filename : null;
        console.log(name, price, description, status, cat_id, featured, is_stock, accessories, warranty, promotion, thumbnail);
        const newProduct = new ProductModel({
            name,
            price,
            description: description || "",
            status: status || "",
            cat_id,
            featured: featured || false,
            is_stock: is_stock || false,
            thumbnail,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            accessories: accessories || "",
            promotion: promotion || "",
            warranty: warranty || ""
        });
        await newProduct.save();
        res.status(201).json({
            status: "success",
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error,
        })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, price, description, status, cat_id, featured, is_stock, accessories, warranty, promotion } = req.body;

        const updateData = {
            name,
            price,
            description: description || "",
            status: status || "",
            cat_id,
            featured: featured === "true" || featured === true,
            is_stock: is_stock === "true" || is_stock === true,
            accessories: accessories || "",
            warranty: warranty || "",
            promotion: promotion || "",
        };

        //update thumbnail nếu có upload ảnh mới
        if (req.file) {
            updateData.thumbnail = req.file.filename;
        }

        //update slug nếu đổi tên
        if (name) {
            updateData.slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: product,
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};




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
