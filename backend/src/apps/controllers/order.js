const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const { VNPay, ignoreLogger } = require('vnpay');
const {dateFormat} = require("vnpay/utils")


exports.order = async (req, res) => {
    const { name, mail, phone, add, items } = req.body;
    try {
        const productIds = items.map(item => item._id);
        const products = await ProductModel.find(
            { _id: { $in: productIds } },
            { price: 1 } // chỉ lấy price
        );
        const productMap = {};
        products.forEach(p => {
            productMap[p._id.toString()] = p.price;
        });
        const OrderItems = items.map(item => ({
            prd_id: item._id,
            qty: item.qty,
            price: productMap[item._id.toString()]
        }));
        const newOrder = {
            totalPrice: OrderItems.reduce((total, item) => total + item.price * item.qty, 0),
            fullName: name,
            address: add,
            email: mail,
            phone: phone,
            method: 1,
            items: OrderItems,
        }
        await new OrderModel(newOrder).save();
        return res.status(200).json({
            status: "success",
            message: "Order created successfully",
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

exports.payment = async (req, res) => {
    try {
        const items = req.body;
        const productIds = items.map(item => item._id);
        const products = await ProductModel.find(
            { _id: { $in: productIds } },
            { price: 1 } // chỉ lấy price
        );
        const productMap = {};
        products.forEach(p => {
            productMap[p._id.toString()] = p.price;
        });
        const OrderItems = items.map(item => ({
            prd_id: item._id,
            qty: item.qty,
            price: productMap[item._id.toString()]
        }));


        const vnpay = new VNPay({
                tmnCode: process.env.VNPAY_TMN_CODE,
                secureSecret: process.env.PAYMENT_SECRET_KEY,
                vnpayHost: 'https://sandbox.vnpayment.vn',
        
                testMode: true,
                hashAlgorithm: 'SHA512',
                enableLog: true,
                loggerFn: ignoreLogger,
                endpoints: {
                    paymentEndpoint: 'paymentv2/vpcpay.html',
                    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
                    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
                }
            });
        
            const tomorrow = new Date();
            const orderId = tomorrow.getTime().toString();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const paymentUrl = await vnpay.buildPaymentUrl({
                vnp_Amount: OrderItems.reduce((total, item) => total + item.price * item.qty, 0),
                vnp_IpAddr: '127.0.0.1',
                vnp_TxnRef: orderId,
                vnp_OrderInfo: 'Thanh toán đơn hàng',
                vnp_OrderType: 'other',
                vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
                vnp_Locale: 'vn',
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow),
            });
            res.status(200).json({
                status: "success",
                url: paymentUrl,
            });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        })
    }


}


exports.vnpayReturn = async (req, res) => {
    const params = req.query;
    if (params.vnp_TransactionStatus === "00") {
        const {name, phone, mail, add, items} = req.body;
        const viewPath = req.app.get("views");
        const html = await ejs.renderFile(
            path.join(viewPath,"site/email-order.ejs"),
            {
                name,
                phone,
                mail,
                add,
                totalPrice : pipe(totalPrice),
                items,
                pipe
            }
        );
        await transporter.sendMail({
            to: mail,
            from: "Node Server",
            subject: "Xác nhận đơn hàng",
            html
        });
        req.session.cart = [];
    }else {
        res.redirect("/fail");
    }
    localStorage.removeItem("infor");
};
