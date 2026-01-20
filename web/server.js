const express = require('express');
const pg = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const { Pool } = pg;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  password: 'ICUI4CUAlways',
  host: 'primary',
  port: 5432,
  database: 'postgres'
});

// Initialize database table
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrants (
        id SERIAL PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        nationality VARCHAR(100),
        passportNumber VARCHAR(50) UNIQUE,
        passportType VARCHAR(50),
        visaType VARCHAR(100),
        visaStatus VARCHAR(50),
        gender VARCHAR(20),
        dateOfBirth DATE,
        email VARCHAR(255),
        phone VARCHAR(20),
        arrivalDate DATE,
        department VARCHAR(100),
        sponsor VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Get all migrants
app.get('/api/migrants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM migrants ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching migrants:', err);
    res.status(500).json({ error: 'Failed to fetch migrants' });
  }
});

// Get single migrant
app.get('/api/migrants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM migrants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Migrant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching migrant:', err);
    res.status(500).json({ error: 'Failed to fetch migrant' });
  }
});

// Create new migrant
app.post('/api/migrants', async (req, res) => {
  try {
    const {
      fullName,
      nationality,
      passportNumber,
      passportType,
      visaType,
      visaStatus,
      gender,
      dateOfBirth,
      email,
      phone,
      arrivalDate,
      department,
      sponsor
    } = req.body;

    const result = await pool.query(
      `INSERT INTO migrants 
       (fullName, nationality, passportNumber, passportType, visaType, visaStatus, gender, dateOfBirth, email, phone, arrivalDate, department, sponsor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        fullName,
        nationality,
        passportNumber,
        passportType,
        visaType,
        visaStatus,
        gender,
        dateOfBirth || null,
        email,
        phone,
        arrivalDate || null,
        department,
        sponsor
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating migrant:', err);
    res.status(500).json({ error: 'Failed to create migrant' });
  }
});

// Update migrant
app.put('/api/migrants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      nationality,
      passportNumber,
      passportType,
      visaType,
      visaStatus,
      gender,
      dateOfBirth,
      email,
      phone,
      arrivalDate,
      department,
      sponsor
    } = req.body;

    const result = await pool.query(
      `UPDATE migrants 
       SET fullName = $1, nationality = $2, passportNumber = $3, passportType = $4, 
           visaType = $5, visaStatus = $6, gender = $7, dateOfBirth = $8, 
           email = $9, phone = $10, arrivalDate = $11, department = $12, sponsor = $13,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        fullName,
        nationality,
        passportNumber,
        passportType,
        visaType,
        visaStatus,
        gender,
        dateOfBirth || null,
        email,
        phone,
        arrivalDate || null,
        department,
        sponsor,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Migrant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating migrant:', err);
    res.status(500).json({ error: 'Failed to update migrant' });
  }
});

// Delete migrant
app.delete('/api/migrants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM migrants WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Migrant not found' });
    }

    res.json({ message: 'Migrant deleted successfully' });
  } catch (err) {
    console.error('Error deleting migrant:', err);
    res.status(500).json({ error: 'Failed to delete migrant' });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN visaStatus = 'Approved' THEN 1 END) as approved,
        COUNT(CASE WHEN visaStatus = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN visaStatus = 'Rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male,
        COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female,
        COUNT(CASE WHEN gender NOT IN ('Male', 'Female') THEN 1 END) as other
      FROM migrants
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  await initDatabase();
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
