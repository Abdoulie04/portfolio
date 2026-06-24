require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const username = 'admin';
const plainPassword = '0017'; // <-- change ce mot de passe

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  db.query(
    'INSERT INTO admin (username, password) VALUES (?, ?)',
    [username, hash],
    (err, result) => {
      if (err) {
        console.error('Erreur :', err.message);
      } else {
        console.log('Compte admin créé avec succès ! Identifiant :', username);
      }
      db.end();
    }
  );
});