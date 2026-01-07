const mongoose = require('../../common/database')();

const pendingOrderSchema = new mongoose.Schema({
    txnRef: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { timestamps: true });

const PendingOrderModel = mongoose.model('PendingOrder', pendingOrderSchema, 'pendingorders');
module.exports = PendingOrderModel;
