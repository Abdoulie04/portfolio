const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');

router.get('/', (req, res) => {
 req.db.query('SELECT * FROM projets ORDER BY created_at DESC', (err, results) => {
   if (err) return res.status(500).json({ error: 'Erreur serveur' });
   res.json(results);
 });
});

router.post('/', requireAuth, (req, res) => {
 const { titre, description, technologies, lien_github, lien_demo, image, categorie } = req.body;
 req.db.query(
   'INSERT INTO projets (titre, description, technologies, lien_github, lien_demo, image, categorie) VALUES (?, ?, ?, ?, ?, ?, ?)',
   [titre, description, technologies, lien_github, lien_demo, image, categorie],
   (err, result) => {
     if (err) return res.status(500).json({ error: 'Erreur serveur' });
     res.json({ message: 'Projet ajouté', id: result.insertId });
   }
 );
});

router.put('/:id', requireAuth, (req, res) => {
 const { titre, description, technologies, lien_github, lien_demo, image, categorie } = req.body;
 req.db.query(
   'UPDATE projets SET titre=?, description=?, technologies=?, lien_github=?, lien_demo=?, image=?, categorie=? WHERE id=?',
   [titre, description, technologies, lien_github, lien_demo, image, categorie, req.params.id],
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