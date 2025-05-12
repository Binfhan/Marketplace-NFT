const jwwt = require('jsonwebtoken');

function restrictTo(...roles) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        //Bear token
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;//luu thông tin user vào req.user
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'No access!' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

module.exports = { restrictTo };