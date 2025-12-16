const OrderModel = require("../models/order")
const ProductModel = require("../models/product")  

exports.order = async (req, res) => {
    const { name, mail, phone, add, items } = req.body;
    try {
        const productIds = items.map(item => item._id);
        
        const productsInDb = await ProductModel.find({ _id: { $in: productIds } });

        const productMap = {};
        productsInDb.forEach(p => {
            productMap[p._id.toString()] = p;
        });

        let totalPrice = 0;
        const orderItems = items.map(item => {
            const dbProduct = productMap[item._id];
            if (!dbProduct) {
                throw new Error(`Sản phẩm với ID ${item._id} không tồn tại hoặc đã bị xóa.`);
            }
            const price = dbProduct.price; 
            totalPrice += price * item.qty;
            
            return {
                prd_id: item._id,
                qty: item.qty,
                price: price 
            };
        });

        const newOrder = {
            totalPrice: totalPrice, 
            fullName: name,
            address: add,
            email: mail,
            phone: phone,
            method: 1,
            items: orderItems
        };
        await new OrderModel(newOrder).save();
        return res.status(200).json({
            status: "success",
            message: "Order created successfully",
        })
    } catch (error)
    {
        return res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}