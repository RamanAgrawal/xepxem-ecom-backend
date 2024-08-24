import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const auth = async (req, res, next) => {

    const token = req.header('auth-token');
        if(!token){
            return res.status(401).json({
                message: 'Invalid Token',
                error: true,
                success: false,
            });
        }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY);
        const user = await User.findOne({ _id: decoded.userId });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid Token',
            error: true,
            success: false,
        });
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).send('Access denied.');
      }
      next();
    };
};

export {auth, authorize}