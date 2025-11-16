const express = require('express');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = path.join(__dirname, 'data', 'db.sqlite');

const db = new sqlite3.Database(DB_PATH);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      acquiredAt TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      value INTEGER NOT NULL,
      FOREIGN KEY(clientId) REFERENCES clients(id) ON DELETE CASCADE
    )`);
  });
}

init();

const app = express();
app.use(cors());
app.use(express.json());

function getClientById(id, cb) {
  db.get('SELECT id, name, email, acquiredAt FROM clients WHERE id = ?', [id], (err, client) => {
    if (err) return cb(err);
    if (!client) return cb(null, null);
    db.all('SELECT id, name, status, value FROM projects WHERE clientId = ?', [id], (err2, projects) => {
      if (err2) return cb(err2);
      client.projects = projects || [];
      cb(null, client);
    });
  });
}

// GET /clients
app.get('/clients', (req, res) => {
  db.all('SELECT id, name, email, acquiredAt FROM clients ORDER BY acquiredAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// POST /clients
app.post('/clients', (req, res) => {
  const { name, email, acquiredAt } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const id = uuidv4();
  const acq = acquiredAt || new Date().toISOString().slice(0,10);
  db.run('INSERT INTO clients(id, name, email, acquiredAt) VALUES (?, ?, ?, ?)', [id, name, email, acq], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    getClientById(id, (err2, client) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(client);
    });
  });
});

// GET /clients/:id
app.get('/clients/:id', (req, res) => {
  getClientById(req.params.id, (err, client) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!client) return res.status(404).json({ error: 'not found' });
    res.json(client);
  });
});

// POST /clients/:id/projects
app.post('/clients/:id/projects', (req, res) => {
  const { name, status, value } = req.body;
  const clientId = req.params.id;
  if (!name || !status || typeof value !== 'number') return res.status(400).json({ error: 'name, status, value required' });
  db.get('SELECT id FROM clients WHERE id = ?', [clientId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'client not found' });
    const id = uuidv4();
    db.run('INSERT INTO projects(id, clientId, name, status, value) VALUES (?, ?, ?, ?, ?)', [id, clientId, name, status, value], function(err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ id, clientId, name, status, value });
    });
  });
});

// GET /clients/:id/projects
app.get('/clients/:id/projects', (req, res) => {
  const clientId = req.params.id;
  db.all('SELECT * FROM projects WHERE clientId = ?', [clientId], (err, rows) => {
  if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// GET /summary
app.get('/summary', (req, res) => {
  db.serialize(() => {
    db.get('SELECT COUNT(*) as totalProjects, COALESCE(SUM(value),0) as totalValue FROM projects', [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ totalProjects: row.totalProjects || 0, totalValue: row.totalValue || 0 });
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));