function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Accès refusé, connecte-toi d\'abord' });
  }
}

module.exports = { requireAuth };