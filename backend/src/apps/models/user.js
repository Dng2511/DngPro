const mongoose = require('../../common/database')();


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        default: null,
    },

    phone: {
        type: String,
        default: null,
    },

    addresses: [
        {
            province: { type: String, required: true }, // Tỉnh/Thành phố
            ward: { type: String, required: true },     // Phường/Xã
            detail: { type: String, required: true },   // Địa chỉ chi tiết
            is_default: { type: Boolean, default: false } // Có thể đánh dấu địa chỉ mặc định
        }
    ],

    cart: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],

    avatar: {
        type: String,
        default: null,
    },
    
    is_banned: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true});
const usersModel = mongoose.model("Users", userSchema, "users");
module.exports = usersModel;