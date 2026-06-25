const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Connexion
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = req.db;

  db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (results.length === 0) return res.status(401).json({ error: 'Identifiants incorrects' });

    const admin = results[0];
    bcrypt.compare(password, admin.password, (err, match) => {
      if (!match) return res.status(401).json({ error: 'Identifiants incorrects' });

      const token = jwt.sign(
        { username: admin.username },
        process.env.SESSION_SECRET,
        { expiresIn: '24h' }
      );
      res.json({ message: 'Connecté avec succès', token, username: admin.username });
    });
  });
});

// Vérifier si connecté
router.get('/check', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ connecte: false });
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    res.json({ connecte: true, username: decoded.username });
  } catch {
    res.json({ connecte: false });
  }
});

// Déconnexion
router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnecté' });
});

module.exports = router;