const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const PendingOrderModel = require("../models/pendingOrder");
const { VNPay, ignoreLogger } = require('vnpay');
const { dateFormat } = require("vnpay/utils");
const crypto = require('crypto');
const pagination = require("../../libs/pagination");


exports.order = async (req, res) => {
    const { name, mail, phone, add, items, paymentMethod } = req.body;
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

        const method = paymentMethod === 'vnpay' ? 1 : 0;

        const userId = req.user && (req.user._id || req.user.id) ? (req.user._id || req.user.id) : null;
        const newOrder = {
            user: userId,
            totalPrice: OrderItems.reduce((total, item) => total + (item.price || 0) * item.qty, 0),
            fullName: name,
            address: add,
            email: mail,
            phone: phone,
            method,
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

exports.getPaymentUrl = async (req, res) => {
    try {
        const { name, mail, phone, add, items, paymentMethod } = req.body;
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

        const amount = OrderItems.reduce((total, item) => total + (item.price || 0) * item.qty, 0);

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
        const txnRef = tomorrow.getTime().toString();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const method = paymentMethod === 'vnpay' ? 1 : 0;
        const userId = req.user ? req.user._id : null;

        await PendingOrderModel.create({
            txnRef,
            amount,
            data: {
                user: userId,
                totalPrice: OrderItems.reduce((total, item) => total + (item.price || 0) * item.qty, 0),
                fullName: name,
                address: add,
                email: mail,
                phone: phone,
                method,
                items: OrderItems,
            },
            paymentMethod: 'vnpay'
        });

        const returnUrl = 'http://localhost:8000/vnpay/return';

        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: 'Thanh toán đơn hàng',
            vnp_OrderType: 'other',
            vnp_ReturnUrl: returnUrl,
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
    try {
        const params = req.query || {};
        // verify secure hash — try multiple signingData variants (sorted raw, sorted encoded, raw query)
        const secret = process.env.PAYMENT_SECRET_KEY || '';

        const signingDataSortedRaw = Object.keys(params)
            .filter(k => k.startsWith('vnp_') && k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType')
            .sort()
            .map(k => `${k}=${params[k]}`)
            .join('&');

        const signingDataSortedEncoded = Object.keys(params)
            .filter(k => k.startsWith('vnp_') && k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType')
            .sort()
            .map(k => `${k}=${encodeURIComponent(params[k])}`)
            .join('&');

        const rawQuery = (req.originalUrl || req.url || '').split('?')[1] || '';
        const signingDataRawQuery = rawQuery.split('&')
            .filter(p => p && !p.startsWith('vnp_SecureHash=') && !p.startsWith('vnp_SecureHashType='))
            .join('&');

        const candidates = [signingDataSortedRaw, signingDataSortedEncoded, signingDataRawQuery];
        const secureHashRaw = (params.vnp_SecureHash || '').trim();
        const secureHash = secureHashRaw.toLowerCase();

        let isValid = false;
        const computedList = [];
        for (const s of candidates) {
            try {
                const h = crypto.createHmac('sha512', secret).update(s).digest('hex');
                computedList.push({ signing: s, h });
                const computed = (h || '').toLowerCase();
                try {
                    if (secureHash && computed) {
                        if (crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(secureHash, 'hex'))) {
                            isValid = true;
                            break;
                        }
                    }
                } catch (e) {
                    if (computed === secureHash) {
                        isValid = true;
                        break;
                    }
                }
            } catch (e) {
                // ignore candidate failure
            }
        }

        // diagnostic logging
        console.info('[vnpayReturn] txnRef=', params.vnp_TxnRef, 'responseCode=', params.vnp_ResponseCode || params.vnp_TransactionStatus);
        console.debug('[vnpayReturn] candidates=', candidates);
        console.debug('[vnpayReturn] computedList=', computedList);
        console.debug('[vnpayReturn] secureHash=', params.vnp_SecureHash);
        console.debug('[vnpayReturn] isValid=', isValid);

        // if debug flag set, return diagnostics to caller (helpful for sandbox testing)
        if (req.query && req.query.debug === '1') {
            return res.status(200).json({
                params,
                candidates,
                computedList,
                secureHash: params.vnp_SecureHash,
                isValid
            });
        }

        const txnRef = params.vnp_TxnRef;
        const responseCode = params.vnp_ResponseCode || params.vnp_TransactionStatus;

        const clientReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment-success';

        if (!isValid) {
            if (txnRef) {
                await PendingOrderModel.findOneAndUpdate({ txnRef }, { status: 'failed' });
            }
            return res.redirect(`${clientReturnUrl}?vnp_TransactionStatus=99`);
        }

        const pending = await PendingOrderModel.findOne({ txnRef });
        if (!pending) {
            return res.redirect(`${clientReturnUrl}?vnp_TransactionStatus=04`);
        }

        if (responseCode === '00' || params.vnp_TransactionStatus === '00') {
            // create real order if not already created
            if (pending.status !== 'paid') {
                const od = pending.data;
                const newOrder = new OrderModel(od);
                await newOrder.save();
                pending.status = 'paid';
                // link created order to pending record for client queries
                pending.order = newOrder._id;
                await pending.save();
                console.info('[vnpayReturn] order created id=', newOrder._id);
            }
            return res.redirect(`${clientReturnUrl}?vnp_TransactionStatus=00&txnRef=${encodeURIComponent(txnRef)}`);
        } else {
            // payment failed
            pending.status = 'failed';
            await pending.save();
            return res.redirect(`${clientReturnUrl}?vnp_TransactionStatus=${responseCode}`);
        }
    } catch (err) {
        console.error('[vnpayReturn] unexpected error', err);
        const clientReturnUrl = process.env.VNPAY_CLIENT_RETURN_URL || process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment-success';
        return res.redirect(`${clientReturnUrl}?vnp_TransactionStatus=99`);
    }
};
// Get orders for logged-in user
exports.myOrders = async (req, res) => {
    try {
        const userId = req.user && (req.user._id || req.user.id);
        if (!userId) {
            return res.status(403).json({ status: 'error', message: 'User not authenticated' });
        }
        const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 }).populate('items.prd_id', 'name thumbnail');
        return res.status(200).json({ status: 'success', data: orders });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// Return status for a given VNPAY txnRef (used by client to confirm payment)
exports.vnpayStatus = async (req, res) => {
    try {
        const txnRef = req.query.txnRef || req.query.vnp_TxnRef;
        if (!txnRef) return res.status(400).json({ status: 'error', message: 'txnRef is required' });
        const pending = await PendingOrderModel.findOne({ txnRef });
        if (!pending) return res.status(404).json({ status: 'error', message: 'not_found' });
        return res.status(200).json({ status: 'success', data: { txnRef: pending.txnRef, status: pending.status, orderId: pending.order || null } });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};

// Get all orders (admin)
exports.allOrders = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page || "1"), 1);
        const limit = Math.max(parseInt(req.query.limit || "20"), 1);
        const skip = (page - 1) * limit;

        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('items.prd_id', 'name thumbnail')
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            status: 'success',
            filter: { 
                page, 
                limit 
            },
            data: orders,
            pages: await pagination(OrderModel, limit, page, {}),

        });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};