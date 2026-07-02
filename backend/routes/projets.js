const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

router.get('/', (req, res) => {
  req.db.query('SELECT * FROM projets ORDER BY date_creation DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    results.forEach(p => {
      p.images = p.images 
        ? p.images.split(',').map(url => url.trim()).filter(Boolean) 
        : [];
      // Ajoute l'image principale en tête si elle n'est pas déjà dedans
      if (p.image && !p.images.includes(p.image)) {
        p.images.unshift(p.image);
      }
    });
    res.json(results);
  });
});

router.post('/', requireAuth, (req, res) => {
  const { titre, description, technologies, lien_github, lien_demo, image, categorie, images } = req.body;
  const imagesStr = Array.isArray(images) ? images.join(',') : (images || '');
  req.db.query(
    'INSERT INTO projets (titre, description, technologies, lien_github, lien_demo, image, categorie, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [titre, description, technologies, lien_github, lien_demo, image, categorie, imagesStr],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Projet ajouté', id: result.insertId });
    }
  );
});

router.put('/:id', requireAuth, (req, res) => {
  const { titre, description, technologies, lien_github, lien_demo, image, categorie, images } = req.body;
  const imagesStr = Array.isArray(images) ? images.join(',') : (images || '');
  req.db.query(
    'UPDATE projets SET titre=?, description=?, technologies=?, lien_github=?, lien_demo=?, image=?, categorie=?, images=? WHERE id=?',
    [titre, description, technologies, lien_github, lien_demo, image, categorie, imagesStr, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ message: 'Projet modifié' });
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