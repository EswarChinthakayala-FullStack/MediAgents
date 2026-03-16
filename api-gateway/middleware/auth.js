const jwt = require('jsonwebtoken');

const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = { verifyToken };
