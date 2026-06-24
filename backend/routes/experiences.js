const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

router.get('/', (req, res) => {
  req.db.query('SELECT * FROM experiences ORDER BY ordre ASC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

router.post('/', requireAuth, (req, res) => {
  const { annee, titre, etablissement, ordre } = req.body;
  req.db.query(
    'INSERT INTO experiences (annee, titre, etablissement, ordre) VALUES (?, ?, ?, ?)',
    [annee, titre, etablissement, ordre || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Expérience ajoutée', id: result.insertId });
    }
  );
});

router.put('/:id', requireAuth, (req, res) => {
  const { annee, titre, etablissement, ordre } = req.body;
  req.db.query(
    'UPDATE experiences SET annee=?, titre=?, etablissement=?, ordre=? WHERE id=?',
    [annee, titre, etablissement, ordre || 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Expérience modifiée' });
    }
  );
});

router.delete('/:id', requireAuth, (req, res) => {
  req.db.query('DELETE FROM experiences WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Expérience supprimée' });
  });
});

module.exports = router;