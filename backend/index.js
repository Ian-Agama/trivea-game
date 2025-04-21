
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



/*
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const  port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./doctor_who.db');

// Utility to pick a random element from an array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.get('/api/question', (req, res) => {
  const types = ['doctor', 'companion', 'episode'];
  const selectedType = getRandom(types);

  if (selectedType === 'doctor') {
    db.all('SELECT DOCTORID, ACTOR FROM DOCTOR ORDER BY RANDOM() LIMIT 4', [], (err, rows) => {
      if (err) 
        return res.status(500).json({ error: 'Database error' });
      const correct = getRandom(rows);
      const options = rows.map(r => r.ACTOR);
      const correctIndex = options.indexOf(correct.ACTOR);
      res.json({
        type: 'doctor',
        text: `Which actor played Doctor ID ${correct.DOCTORID}?`,
        options,
        correctIndex
    });
});
//   } else if (selectedType === 'companion') {
//     db.all('SELECT NAME, ACTOR FROM COMPANION ORDER BY RANDOM() LIMIT 4', [], (err, rows) => {
//       if (err || rows.length < 4) return res.status(500).json({ error: ' error' });
//       const correct = getRandom(rows);
//       const options = rows.map(r => r.ACTOR);
//       const correctIndex = options.indexOf(correct.ACTOR);
//       res.json({
//         type: 'companion',
//         text: `Which actor played the companion ${correct.NAME}?`,
//         options,
//         correctIndex
//       });
//     });
//   } else {
//     db.all('SELECT STORYID, TITLE, SEASONYEAR FROM EPISODE ORDER BY RANDOM() LIMIT 4', [], (err, rows) => {
//       if (err || rows.length < 4) return res.status(500).json({ error: 'Database error' });
//       const correct = getRandom(rows);
//       const options = rows.map(r => r.SEASONYEAR.toString());
//       const correctIndex = options.indexOf(correct.SEASONYEAR.toString());
//       res.json({
//         type: 'episode',
//         text: `What year did the episode "${correct.TITLE}" air?`,
//         options,
//         correctIndex
//       });
//     });
//   }
}});

app.listen(port, () => {
  console.log(`Doctor Who Trivia server running at http://localhost:${port}`);
});
*/
/*
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT =  3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'doctorwho.db');
const db = new sqlite3.Database(dbPath);

app.get('/api/doctors', (req, res) => {
  db.all('SELECT * FROM doctor', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/episodes', (req, res) => {
  db.all('SELECT * FROM episode', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/companions', (req, res) => {
  db.all('SELECT * FROM companion', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/questions', (req, res) => {
  db.all('SELECT * FROM questions ORDER BY RANDOM() LIMIT 10', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/answer', (req, res) => {
  const { questionId, selectedAnswer } = req.body;
  db.get('SELECT correct_answer FROM questions WHERE id = ?', [questionId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const isCorrect = row && row.correct_answer === selectedAnswer;
    res.json({ correct: isCorrect });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/