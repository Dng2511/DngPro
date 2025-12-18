const UserModel = require("../models/user");
const ProductModel = require("../models/product");
const bcrypt = require("bcrypt");

const createToken = require("../../libs/createToken");



exports.registerForCustomer = async (req, res) => {
    try {
        const { full_name, email, password, phone } = req.body;
        const existing = await UserModel.findOne({ email, role: "customer" });
        if (existing) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new UserModel({ full_name, email, password: hashed, phone, role: "customer" });
        await user.save();
        res.status(201).json({
            status: "success",
            message: "Customer registered",
            data: { id: user._id, full_name: user.full_name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

exports.registerForStaff = async (req, res) => {
    try {
        const { full_name, email, password, phone } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ status: "error", message: "Access denied" });
        }
        const existing = await UserModel.findOne({ email, role: "staff" });
        if (existing) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new UserModel({ full_name, email, password: hashed, phone, role: "staff" });
        await user.save();
        res.status(201).json({
            status: "success",
            message: "Staff registered",
            data: { id: user._id, full_name: user.full_name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const role = req.params.role;
        const user = await UserModel.findOne({ email, role });
        if (!user) {
            return res.status(404).json({
                status: "error",
                code: "USER_NOT_FOUND",
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                code: "WRONG_PASSWORD",
                message: "Incorrect password"
            });
        }

        // Đúng mật khẩu
        return res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
            token: createToken({ _id: user._id, role: user.role })

        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

exports.index = async (req, res) => {
    try {
        const users = await UserModel.find()
            .select("-password -cart") // không trả về mật khẩu và giỏ hàng
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            status: "success",
            data: { docs: users },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId).select("-password -cart");
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error });
    }
};

// Update email
exports.updateEmail = async (req, res) => {
    try {
        const userId = req.user._id;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: "error", message: "Email is required" });
        }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { email },
            { new: true }
        ).select("-password -cart");

        res.status(200).json({
            status: "success",
            message: "Email updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Update phone
exports.updatePhone = async (req, res) => {
    try {
        const userId = req.user._id;
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ status: "error", message: "Phone is required" });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { phone },
            { new: true }
        ).select("-password -cart");

        res.status(200).json({
            status: "success",
            message: "Phone updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ status: "error", message: "Both passwords are required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Add address
exports.addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { province, ward, detail, is_default } = req.body;

        if (!province || !ward || !detail) {
            return res.status(400).json({ status: "error", message: "Province, ward, and detail are required" });
        }

        const newAddress = {
            province,
            ward,
            detail,
            is_default: is_default || false,
        };

        let user;
        if (is_default) {
            // If new address is default, set all other addresses to not default
            await UserModel.updateOne(
                { _id: userId },
                { $set: { "addresses.$[].is_default": false } }
            );
            user = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { addresses: newAddress } },
                { new: true }
            ).select("-password -cart");
        } else {
            user = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { addresses: newAddress } },
                { new: true }
            ).select("-password -cart");
        }

        // Get the newly added address
        const addedAddress = user.addresses[user.addresses.length - 1];

        res.status(201).json({
            status: "success",
            message: "Address added successfully",
            data: addedAddress,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error });
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;
        const { province, ward, detail, is_default } = req.body;

        if (!province || !ward || !detail) {
            return res.status(400).json({ status: "error", message: "Province, ward, and detail are required" });
        }

        if (is_default) {
            // If this address is set as default, set all addresses to not default first
            await UserModel.findByIdAndUpdate(
                userId,
                { $set: { "addresses.$[].is_default": false } },
                { new: true }
            );
        }

        const user = await UserModel.findOneAndUpdate(
            { _id: userId, "addresses._id": addressId },
            {
                $set: {
                    "addresses.$.province": province,
                    "addresses.$.ward": ward,
                    "addresses.$.detail": detail,
                    "addresses.$.is_default": is_default || false,
                },
            },
            { new: true }
        ).select("-password -cart");

        if (!user) {
            return res.status(404).json({ status: "error", message: "Address not found" });
        }

        // Get the updated address
        const updatedAddress = user.addresses.find(a => a._id.toString() === addressId);

        res.status(200).json({
            status: "success",
            message: "Address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        ).select("-password -cart");

        if (!user) {
            return res.status(404).json({ status: "error", message: "Address not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Address deleted successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};


// Get Cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await UserModel.findById(userId)
            .select("cart")
            .populate({
                path: "cart.product_id",
                select: "_id name thumbnail price"
            });

        const formattedCart = cart.cart.map(item => ({
            _id: item.product_id._id,
            name: item.product_id.name,
            thumbnail: item.product_id.thumbnail,
            price: item.product_id.price,
            qty: item.quantity,
        }));

        res.status(200).json({
            status: "success",
            data: formattedCart,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product_id, quantity } = req.body;
        if (!product_id) {
            return res.status(400).json({
                status: "error",
                message: "Product ID are required"
            });
        };
        const user = await UserModel.findById(userId).select("cart");
        const productIndex = user.cart.findIndex(item => item.product_id.toString() === product_id);
        if (productIndex > -1) {
            if (!quantity) user.cart[productIndex].quantity += 1;
            else if (quantity <= 0) user.cart.splice(productIndex, 1);
            else user.cart[productIndex].quantity = quantity;
        } else {
            // Product does not exist in cart, add new item
            user.cart.push({ product_id, quantity: quantity || 1 });
        }
        await user.save();
        res.status(200).json({
            status: "success",
            message: "Cart updated successfully",
            data: user.cart,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "Product ID are required"
            });
        }
        const user = await UserModel.findById(userId).select("cart");
        const productIndex = user.cart.findIndex(item => item.product_id.toString() === id);
        if (productIndex > -1) {
            user.cart.splice(productIndex, 1);
            await user.save();
            res.status(200).json({
                status: "success",
                message: "Product removed from cart",
                data: user.cart,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error
        });
    }
};




