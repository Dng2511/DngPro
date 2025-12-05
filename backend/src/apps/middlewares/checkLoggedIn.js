const jwt = require('jsonwebtoken');

const checkLoggedIn = (role) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "No token provided",
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (role && decoded.role !== role) {
                return res.status(403).json({ message: 'Access denied' });
            }
            req.user = decoded; // lưu user vào req để controller sử dụng
            next();
        } catch (err) {
            return res.status(403).json({ message: err.message });
        }
    }
};

module.exports = checkLoggedIn;