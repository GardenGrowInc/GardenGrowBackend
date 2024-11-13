const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtMiddleware = (req, res, next) => {
    const token = req.header('authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'GardenGrow', (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err.message);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

const adminJwtMiddleware = (req, res, next) => {
    const token = req.header('authorization')?.split(' ')[1];
    console.log("token", token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'GardenGrowAdmin', (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err.message);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("decoded", decoded);
        req.userId = decoded.id; // Attach the decoded user ID to the request
        next(); // Move to the next middleware or route handler
    });
};

module.exports = { jwtMiddleware, adminJwtMiddleware };
