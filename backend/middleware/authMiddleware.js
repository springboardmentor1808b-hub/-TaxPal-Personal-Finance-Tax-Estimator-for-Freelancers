const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Support both 'Authorization: Bearer <token>' and 'x-auth-token'
    const authHeader = req.header('authorization') || req.header('Authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid or expired" });
    }
};