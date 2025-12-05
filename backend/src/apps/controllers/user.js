const UserModel = require("../models/user");
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
        .select("-password") // không trả về mật khẩu
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

