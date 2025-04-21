const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = new sqlite3.Database('./doctor_who.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit the app if the database connection fails
  }
  console.log('Connected to SQLite database.');
});

// Validate API endpoints exist and handle any unknown routes
app.use((req, res, next) => {
  const allowedRoutes = [
    '/api/questions',
    '/api/doctors',
    '/api/episodes',
    '/api/companions',
    '/api/answer',
  ];

  if (!allowedRoutes.includes(req.path) && !req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  next();
});

// Routes

// Get all trivia questions
app.get('/api/questions', (req, res) => {
  db.all('SELECT * FROM questions', [], (err, rows) => {
    if (err) {
      console.error('Error fetching trivia questions:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// Get all doctors
app.get('/api/doctors', (req, res) => {
  db.all('SELECT * FROM doctor', [], (err, rows) => {
    if (err) {
      console.error('Error fetching doctors:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// Get all episodes
app.get('/api/episodes', (req, res) => {
  db.all('SELECT * FROM episode', [], (err, rows) => {
    if (err) {
      console.error('Error fetching episodes:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// Get all companions
app.get('/api/companions', (req, res) => {
  db.all('SELECT * FROM companion', [], (err, rows) => {
    if (err) {
      console.error('Error fetching companions:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// Check if an answer is correct
app.post('/api/answer', (req, res) => {
  const { questionId, selectedAnswer } = req.body;

  // Validate request data
  if (!questionId || !selectedAnswer) {
    return res.status(400).json({ error: 'Missing question ID or selected answer' });
  }

  db.get('SELECT correct_answer FROM questions WHERE id = ?', [questionId], (err, row) => {
    if (err) {
      console.error('Error fetching correct answer:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = row.correct_answer === selectedAnswer;
    res.json({ correct: isCorrect });
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Doctor Who Trivia API is running at http://localhost:${port}`);
});
