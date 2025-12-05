const jwt = require('jsonwebtoken');

const checkLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        req.user = null; // Không có token thì bỏ qua
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // lưu user vào req để controller sử dụng
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = checkLoggedIn;