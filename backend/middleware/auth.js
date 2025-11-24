const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecret_jwt_key_here';

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token') || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};
