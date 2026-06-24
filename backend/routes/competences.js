const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

router.get('/', (req, res) => {
  req.db.query('SELECT * FROM competences ORDER BY id ASC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

router.post('/', requireAuth, (req, res) => {
  const { nom, niveau } = req.body;
  req.db.query(
    'INSERT INTO competences (nom, niveau) VALUES (?, ?)',
    [nom, niveau],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Compétence ajoutée', id: result.insertId });
    }
  );
});

router.put('/:id', requireAuth, (req, res) => {
  const { nom, niveau } = req.body;
  req.db.query(
    'UPDATE competences SET nom=?, niveau=? WHERE id=?',
    [nom, niveau, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Compétence modifiée' });
    }
  );
});

router.delete('/:id', requireAuth, (req, res) => {
  req.db.query('DELETE FROM competences WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Compétence supprimée' });
  });
});

module.exports = router;