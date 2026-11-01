require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const projetsRoutes = require('./routes/projets');
const messagesRoutes = require('./routes/messages');
const competencesRoutes = require('./routes/competences');
const experiencesRoutes = require('./routes/experiences');
const app = express();

// Important pour que les cookies secure fonctionnent derrière un proxy (Render, etc.)
app.set('trust proxy', 1);

// Connexion MySQL (SSL activé uniquement si DB_SSL=true, requis par TiDB Cloud)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  ssl: process.env.DB_SSL === 'true'
    ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
    return;
  }
  console.log('Connecté à MySQL avec succès !');
  connection.release();
});

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Rendre db accessible dans les routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/projets', projetsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/competences', competencesRoutes);
app.use('/api/experiences', experiencesRoutes);

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});