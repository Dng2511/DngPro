const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Không có token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // lưu user vào req để controller sử dụng
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = verifyToken;
