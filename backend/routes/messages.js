const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

// Recevoir un message (public, depuis le formulaire de contact)
router.post('/', (req, res) => {
  const { nom, email, sujet, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  req.db.query(
    'INSERT INTO messages (nom, email, sujet, message) VALUES (?, ?, ?, ?)',
    [nom, email, sujet, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Message envoyé avec succès', id: result.insertId });
    }
  );
});

// Lister tous les messages (admin uniquement)
router.get('/', requireAuth, (req, res) => {
  req.db.query('SELECT * FROM messages ORDER BY date_envoi DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// Marquer comme lu (admin uniquement)
router.put('/:id/lu', requireAuth, (req, res) => {
  req.db.query('UPDATE messages SET lu = TRUE WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Marqué comme lu' });
  });
});

// Supprimer un message (admin uniquement)
router.delete('/:id', requireAuth, (req, res) => {
  req.db.query('DELETE FROM messages WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Message supprimé' });
  });
});

module.exports = router;