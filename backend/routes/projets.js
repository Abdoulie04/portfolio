const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

router.get('/', (req, res) => {
  req.db.query('SELECT * FROM projets ORDER BY created_at DESC', (err, projets) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (projets.length === 0) return res.json([]);

    req.db.query('SELECT * FROM projet_images ORDER BY ordre ASC', (err2, images) => {
      if (err2) return res.status(500).json({ error: 'Erreur serveur' });

      const result = projets.map(p => ({
        ...p,
        images: images.filter(img => img.projet_id === p.id).map(img => img.url)
      }));
      res.json(result);
    });
  });
});

router.post('/', requireAuth, (req, res) => {
  const { titre, description, technologies, lien_github, lien_demo, image, categorie, images } = req.body;
  req.db.query(
    'INSERT INTO projets (titre, description, technologies, lien_github, lien_demo, image, categorie) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [titre, description, technologies, lien_github, lien_demo, image, categorie],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      const projetId = result.insertId;

      if (images && images.length > 0) {
        const vals = images.map((url, i) => [projetId, url, i]);
        req.db.query('INSERT INTO projet_images (projet_id, url, ordre) VALUES ?', [vals], (err2) => {
          if (err2) return res.status(500).json({ error: 'Erreur images' });
          res.json({ message: 'Projet ajouté', id: projetId });
        });
      } else {
        res.json({ message: 'Projet ajouté', id: projetId });
      }
    }
  );
});

router.put('/:id', requireAuth, (req, res) => {
  const { titre, description, technologies, lien_github, lien_demo, image, categorie, images } = req.body;
  req.db.query(
    'UPDATE projets SET titre=?, description=?, technologies=?, lien_github=?, lien_demo=?, image=?, categorie=? WHERE id=?',
    [titre, description, technologies, lien_github, lien_demo, image, categorie, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });

      req.db.query('DELETE FROM projet_images WHERE projet_id=?', [req.params.id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Erreur images' });

        if (images && images.length > 0) {
          const vals = images.map((url, i) => [req.params.id, url, i]);
          req.db.query('INSERT INTO projet_images (projet_id, url, ordre) VALUES ?', [vals], (err3) => {
            if (err3) return res.status(500).json({ error: 'Erreur images' });
            res.json({ message: 'Projet modifié' });
          });
        } else {
          res.json({ message: 'Projet modifié' });
        }
      });
    }
  );
});

router.delete('/:id', requireAuth, (req, res) => {
  req.db.query('DELETE FROM projets WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Projet supprimé' });
  });
});

module.exports = router;