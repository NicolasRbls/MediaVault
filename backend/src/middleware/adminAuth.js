const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token format is not valid: Bearer <token>' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // Check for admin role from the token payload
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
        }

        // Add user payload to request
        req.user = decoded;
        next();

    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}

module.exports = adminAuth;