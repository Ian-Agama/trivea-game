
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./doctor_who.db');
app.get('/', (req, res) => {
    res.send("Hello world");
  });
;
app.get("/api", cors(), async (req, res) => {
  try {
      res.json(await fetchAll());
  } catch (error) {
      res.json({ status: "FETCHALL FAILED"});
      console.error(error);
  }
});

app.get('/api/', (req, res) => {
  db.all('SELECT * FROM questions', (err, rows) => {
    //f (err)return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Get all trivia questions
app.get('/api/questions', (req, res) => {
  db.all('SELECT * FROM questions', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all doctors
app.get('/api/doctors', (req, res) => {
  db.all('SELECT * FROM doctor', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all episodes
app.get('/api/episodes', (req, res) => {
  db.all('SELECT * FROM episode', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all companions
app.get('/api/companions', (req, res) => {
  db.all('SELECT * FROM companion', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Check if an answer is correct
app.post('/api/answer', (req, res) => {
  const { questionId, selectedAnswer } = req.body;
  db.get('SELECT correct_answer FROM questions WHERE id = ?', [questionId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Question not found' });
    const isCorrect = row.correct_answer === selectedAnswer;
    res.json({ correct: isCorrect });
  });
});

app.listen(port, () => {
  console.log(`Doctor Who Trivia API is running at http://localhost:${port}`);
});



