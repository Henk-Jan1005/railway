const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('PUBGOLF API werkt!'));

// GET scoreboard
app.get('/scoreboards/:group', async (req, res) => {
  const { group } = req.params;
  try {
    const result = await db.query(
      'SELECT data FROM scoreboards WHERE group_id = $1 LIMIT 1',
      [group]
    );
    res.json(result.rows[0]?.data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT scoreboard
app.put('/scoreboards/:group', async (req, res) => {
  const { group } = req.params;
  const data = req.body;
  try {
    await db.query(
      `INSERT INTO scoreboards (group_id, data)
       VALUES ($1, $2)
       ON CONFLICT (group_id)
       DO UPDATE SET data = $2`,
      [group, data]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE scoreboard
app.delete('/scoreboards/:group', async (req, res) => {
  const { group } = req.params;
  try {
    await db.query('DELETE FROM scoreboards WHERE group_id = $1', [group]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET challenges
app.get('/challenges', async (req, res) => {
  try {
    const result = await db.query('SELECT name, completed_by FROM challenges');
    const challenges = {};
    result.rows.forEach(row => {
      challenges[row.name] = { completedBy: row.completed_by };
    });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT challenges (vervangt alles)
app.put('/challenges', async (req, res) => {
  const newData = req.body;
  try {
    await db.query('DELETE FROM challenges');
    for (const name in newData) {
      const completed_by = newData[name].completedBy;
      await db.query(
        'INSERT INTO challenges (name, completed_by) VALUES ($1, $2)',
        [name, completed_by]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE challenges
app.delete('/challenges', async (req, res) => {
  try {
    await db.query('DELETE FROM challenges');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server draait op poort ' + PORT));