const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Accès refusé, connecte-toi d\'abord' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = { requireAuth };