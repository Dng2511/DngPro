const UserModel = require("../models/user");
const bcrypt = require("bcrypt");



exports.registerForCustomer = async (req, res) => {
    const { full_name, emails, password, phone } = req.body;

    try {
        const existing = await UserModel.findOne({ emails, role: "customer" });
        if (existing) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new UserModel({ full_name, emails, password: hashed, phone, role: "customer" });
        await user.save();
        res.status(201).json({
            status: "success",
            message: "Customer registered",
            data: { id: user._id, full_name: user.full_name, emails: user.emails },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

exports.registerForStaff = async (req, res) => {
    const { full_name, emails, password, phone } = req.body;
    try {
        const existing = await UserModel.findOne({ emails, role: "staff" });
        if (existing) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new UserModel({ full_name, emails, password: hashed, phone, role: "staff" });
        await user.save();
        res.status(201).json({
            status: "success",
            message: "Staff registered",
            data: { id: user._id, full_name: user.full_name, emails: user.emails },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

exports.login = async (req, res) => {
    const { emails, password } = req.body;
    const role = req.params.role;
    try {
        const user = await UserModel.findOne({ emails, role });
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
                emails: user.emails,
                role: user.role
            },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
