const { CONSTRAINT } = require('sqlite3');

// seed.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./doctor_who.db');

db.serialize(() => {
        
// Drop existing tables if they exist
db.run('DROP TABLE IF EXISTS companion');
db.run('DROP TABLE IF EXISTS questions');
db.run('DROP TABLE IF EXISTS episode');
db.run('DROP TABLE IF EXISTS doctor');

// Create tables
db.run(`
        CREATE TABLE doctor (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        actor TEXT NOT NULL,
        debut_year INTEGER,
        image_url TEXT
        )
`);

db.run(`
        CREATE TABLE episode (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        season INTEGER,
        episode_number INTEGER,
        air_date TEXT,
        doctor_id INTEGER,
        FOREIGN KEY (doctor_id) REFERENCES doctor(id)
        )
`);

db.run(`
        CREATE TABLE companion (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        actor TEXT NOT NULL,
        first_appearance INTEGER,
        doctor_id INTEGER,
        FOREIGN KEY (doctor_id) REFERENCES doctor(id),
        FOREIGN KEY (first_appearance) REFERENCES episode(id)
        )
`);

db.run(`
        CREATE TABLE questions (
        id INTEGER PRIMARY KEY,
        question TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        wrong_answer1 TEXT NOT NULL,
        wrong_answer2 TEXT NOT NULL,
        wrong_answer3 TEXT NOT NULL,
        doctor_id INTEGER,
        episode_id INTEGER,
        FOREIGN KEY (doctor_id) REFERENCES doctor(id),
        FOREIGN KEY (episode_id) REFERENCES episode(id)
        )
`);

// Seed doctors
const doctors = [
        { id: 1, name: "First Doctor", actor: "William Hartnell", debut_year: 1963, image_url: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 2, name: "Second Doctor", actor: "Patrick Troughton", debut_year: 1966, image_url: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 3, name: "Third Doctor", actor: "Jon Pertwee", debut_year: 1970, image_url: "https://images.pexels.com/photos/325520/pexels-photo-325520.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 4, name: "Fourth Doctor", actor: "Tom Baker", debut_year: 1974, image_url: "https://images.pexels.com/photos/1595085/pexels-photo-1595085.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 10, name: "Tenth Doctor", actor: "David Tennant", debut_year: 2005, image_url: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 11, name: "Eleventh Doctor", actor: "Matt Smith", debut_year: 2010, image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 13, name: "Thirteenth Doctor", actor: "Jodie Whittaker", debut_year: 2018, image_url: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 14, name: "Fourteenth Doctor", actor: "Ncuti Gatwa", debut_year: 2023, image_url: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400" }
];

const doctorStmt = db.prepare('INSERT INTO doctor VALUES (?, ?, ?, ?, ?)');
doctors.forEach(d => doctorStmt.run(d.id, d.name, d.actor, d.debut_year, d.image_url));
doctorStmt.finalize();

// Seed episodes
const episodes = [
        { id: 1, title: "An Unearthly Child", season: 1, episode_number: 1, air_date: "1963-11-23", doctor_id: 1 },
        { id: 2, title: "The Daleks", season: 1, episode_number: 2, air_date: "1963-12-21", doctor_id: 1 },
        { id: 3, title: "The Web Planet", season: 2, episode_number: 5, air_date: "1965-02-13", doctor_id: 1 },
        { id: 4, title: "The Power of the Daleks", season: 4, episode_number: 3, air_date: "1966-11-05", doctor_id: 2 },
        { id: 5, title: "Spearhead from Space", season: 7, episode_number: 1, air_date: "1970-01-03", doctor_id: 3 },
        { id: 6, title: "Genesis of the Daleks", season: 12, episode_number: 4, air_date: "1975-03-08", doctor_id: 4 },
        { id: 7, title: "The Eleventh Hour", season: 31, episode_number: 1, air_date: "2010-04-03", doctor_id: 11 },
        { id: 8, title: "Blink", season: 29, episode_number: 10, air_date: "2007-06-09", doctor_id: 10 },
        { id: 9, title: "The Woman Who Fell to Earth", season: 37, episode_number: 1, air_date: "2018-10-07", doctor_id: 13 },
        { id: 10, title: "The Star Beast", season: 1, episode_number: 1, air_date: "2023-11-25", doctor_id: 14 }
];

const episodeStmt = db.prepare('INSERT INTO episode VALUES (?, ?, ?, ?, ?, ?)');
episodes.forEach(e => episodeStmt.run(e.id, e.title, e.season, e.episode_number, e.air_date, e.doctor_id));
episodeStmt.finalize();

// Seed companions
const companions = [
        { id: 1, name: "Susan Foreman", actor: "Carole Ann Ford", first_appearance: 1, doctor_id: 1 },
        { id: 2, name: "Jamie McCrimmon", actor: "Frazer Hines", first_appearance: 4, doctor_id: 2 },
        { id: 3, name: "Jo Grant", actor: "Katy Manning", first_appearance: 5, doctor_id: 3 },
        { id: 4, name: "Sarah Jane Smith", actor: "Elisabeth Sladen", first_appearance: 6, doctor_id: 4 },
        { id: 5, name: "Rose Tyler", actor: "Billie Piper", first_appearance: 8, doctor_id: 10 },
        { id: 6, name: "Amy Pond", actor: "Karen Gillan", first_appearance: 7, doctor_id: 11 },
        { id: 7, name: "Yasmin Khan", actor: "Mandip Gill", first_appearance: 9, doctor_id: 13 },
        { id: 8, name: "Ruby Sunday", actor: "Millie Gibson", first_appearance: 10, doctor_id: 14 }
];

const companionStmt = db.prepare('INSERT INTO companion VALUES (?, ?, ?, ?, ?)');
companions.forEach(c => companionStmt.run(c.id, c.name, c.actor, c.first_appearance, c.doctor_id));
companionStmt.finalize();

// Seed questions
const questions = [
        {
        question: "Who played the Tenth Doctor?",
        correct_answer: "David Tennant",
        wrong_answer1: "Matt Smith",
        wrong_answer2: "Christopher Eccleston",
        wrong_answer3: "Peter Capaldi",
        doctor_id: 10,
        episode_id: null
        },
        {
        question: "In which episode did the Weeping Angels first appear?",
        correct_answer: "Blink",
        wrong_answer1: "The Time of Angels",
        wrong_answer2: "The Angels Take Manhattan",
        wrong_answer3: "Village of the Angels",
        doctor_id: 10,
        episode_id: 8
        },
        {
        question: "What is the name of the Doctor's home planet?",
        correct_answer: "Gallifrey",
        wrong_answer1: "Skaro",
        wrong_answer2: "Mondas",
        wrong_answer3: "Trenzalore",
        doctor_id: null,
        episode_id: null
        },
        {
        question: "Which companion traveled with the Eleventh Doctor?",
        correct_answer: "Amy Pond",
        wrong_answer1: "Rose Tyler",
        wrong_answer2: "Martha Jones",
        wrong_answer3: "Donna Noble",
        doctor_id: 11,
        episode_id: 7
        },
        {
        question: "What is the Doctor's time machine called?",
        correct_answer: "TARDIS",
        wrong_answer1: "SIDRAT",
        wrong_answer2: "TOMTIT",
        wrong_answer3: "TITAN",
        doctor_id: null,
        episode_id: null
        },
        {
        question: "Who created the Daleks?",
        correct_answer: "Davros",
        wrong_answer1: "The Master",
        wrong_answer2: "The Rani",
        wrong_answer3: "Rassilon",
        doctor_id: 4,
        episode_id: 6
        },
        {
        question: "What is the home planet of the Daleks?",
        correct_answer: "Skaro",
        wrong_answer1: "Gallifrey",
        wrong_answer2: "Mondas",
        wrong_answer3: "Telos",
        doctor_id: null,
        episode_id: 2
        },
        {
        question: "What is the name of the Thirteenth Doctor's sonic screwdriver?",
        correct_answer: "Sonic Swiss Army Knife",
        wrong_answer1: "Sonic Wand",
        wrong_answer2: "Sonic Pen",
        wrong_answer3: "Sonic Torch",
        doctor_id: 13,
        episode_id: 9
        },
        {
        question: "Which actor played the First Doctor?",
        correct_answer: "William Hartnell",
        wrong_answer1: "Patrick Troughton",
        wrong_answer2: "Jon Pertwee",
        wrong_answer3: "Tom Baker",
        doctor_id: 1,
        episode_id: 1
        },
        {
        question: "What species is the character Strax?",
        correct_answer: "Sontaran",
        wrong_answer1: "Silurian",
        wrong_answer2: "Ice Warrior",
        wrong_answer3: "Zygon",
        doctor_id: 11,
        episode_id: null
        }
];

const questionStmt = db.prepare(`INSERT INTO questions (
        question, correct_answer, wrong_answer1, wrong_answer2, wrong_answer3, doctor_id, episode_id
) VALUES (?, ?, ?, ?, ?, ?, ?)`);

questions.forEach(q => {
        questionStmt.run(
        q.question,
        q.correct_answer,
        q.wrong_answer1,
        q.wrong_answer2,
        q.wrong_answer3,
        q.doctor_id,
        q.episode_id
        );
});
questionStmt.finalize();

console.log(" successfully Updated!");
});

// Close DB connection


console.log(db.all("SELECT * FROM DOCTOR"));
db.close();
