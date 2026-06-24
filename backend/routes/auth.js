const express = require('express');
const bcrypt = require('bcryptjs');
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

      req.session.isAdmin = true;
      req.session.username = admin.username;
      res.json({ message: 'Connecté avec succès', username: admin.username });
    });
  });
});

// Vérifier si connecté
router.get('/check', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ connecte: true, username: req.session.username });
  } else {
    res.json({ connecte: false });
  }
});

// Déconnexion
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Déconnecté' });
  });
});

module.exports = router;