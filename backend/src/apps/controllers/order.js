const OrderModel = require("../models/order")

exports.order = async (req, res) => {
    const { name, mail, phone, add, items } = req.body;
    try
    {
        const newOrder = {
            totalPrice: items.reduce((total, item) => total + item.price * item.qty, 0),
            fullName: name,
            address: add,
            email: mail,
            phone: phone,
            method: 1,
            items: items.map(item => ({
                prd_id: item._id,
                qty: item.qty,
                price: item.price
            }))
        }
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