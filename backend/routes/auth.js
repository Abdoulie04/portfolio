const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
        { id: admin.id, username: admin.username },
        process.env.SESSION_SECRET,
        { expiresIn: '2h' }
      );
      res.json({ message: 'Connecté avec succès', username: admin.username, token });
    });
  });
});

router.get('/check', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ connecte: false });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    res.json({ connecte: true, username: decoded.username });
  } catch (err) {
    res.json({ connecte: false });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnecté' });
});

module.exports = router;