// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LANG_FILE = path.join(DATA_DIR, 'languages.json');
const PROVERB_FILE = path.join(DATA_DIR, 'proverbs.json');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const FAQ_FILE = path.join(DATA_DIR, 'faq.json');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Ensure data folder and users file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);

// --- API Endpoints ---

// Languages (42 mother tongues)
app.get('/api/languages', (req, res) => {
  const langs = readJSON(LANG_FILE) || [];
  res.json({ languages: langs });
});

// Signup / profile creation
app.post('/api/signup', (req, res) => {
  const { name, ageGroup, language, motherTongue, learning, email } = req.body;
  if (!name || !ageGroup || !language) {
    return res.status(400).json({ message: 'Name, age group and language are required.' });
  }
  const users = readJSON(USERS_FILE) || [];
  const id = nanoid(8);
  const user = {
    id,
    name,
    email: email || null,
    ageGroup,
    language,
    motherTongue: motherTongue || null,
    learning: Array.isArray(learning) ? learning : (learning ? [learning] : []),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeJSON(USERS_FILE, users);
  res.json({ message: 'Signup successful', user });
});

// Get daily proverb (randomized, localized)
app.get('/api/proverb', (req, res) => {
  const lang = (req.query.lang || 'english').toLowerCase();
  const proverbs = readJSON(PROVERB_FILE) || {};
  const list = proverbs[lang] || proverbs['english'] || [];
  const proverb = list[Math.floor(Math.random() * list.length)] || { text: 'Wisdom is shared.' };
  res.json({ proverb });
});

// Get books by age group and language
app.get('/api/books', (req, res) => {
  const ageGroup = req.query.ageGroup || '5-12';
  const lang = (req.query.lang || 'english').toLowerCase();
  const books = readJSON(BOOKS_FILE) || {};
  const list = (books[ageGroup] || []).map(b => {
    const variant = (b.variants || []).find(v => v.lang === lang) || null;
    return { ...b, variant };
  });
  res.json({ books: list });
});

// FAQ (localized)
app.get('/api/faq', (req, res) => {
  const lang = (req.query.lang || 'english').toLowerCase();
  const faq = readJSON(FAQ_FILE) || {};
  res.json({ faq: faq[lang] || faq['english'] || [] });
});

// Activities listing (simple)
app.get('/api/activities', (req, res) => {
  const activities = [
    { id: 'reading-1', type: 'reading_test', title: 'Beginner Reading Test', ageGroup: '5-12', level: 'local' },
    { id: 'writing-1', type: 'writing_competition', title: 'Short Story Contest', ageGroup: '13-17', level: 'regional' },
    { id: 'puzzle-1', type: 'word_puzzle', title: 'Word Puzzle Pack', ageGroup: '5-12', level: 'local' },
    { id: 'spelling-weekly', type: 'spelling_contest', title: 'Weekly Spelling Bee', ageGroup: '5-12', level: 'national' }
  ];
  res.json({ activities });
});

// Submit activity entry (mock)
app.post('/api/activities/submit', (req, res) => {
  const { userId, activityId, payload } = req.body;
  if (!userId || !activityId) return res.status(400).json({ message: 'userId and activityId required' });
  res.json({ message: 'Entry received', entryId: nanoid(10) });
});

// Simple user lookup
app.get('/api/user/:id', (req, res) => {
  const users = readJSON(USERS_FILE) || [];
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`ELEWA prototype running on http://localhost:${PORT}`));
