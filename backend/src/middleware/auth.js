const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user
    return next()
  }
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' })
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' })
  }
}
module.exports = authMiddleware
