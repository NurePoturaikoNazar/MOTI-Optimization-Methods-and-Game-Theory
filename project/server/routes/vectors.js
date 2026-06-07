const { db } = require('../database');
const router = require('express').Router();

// GET всі оцінки
router.get('/', async (req, res) => {
  try {
    res.json(await db.allAsync('SELECT * FROM Vector'));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /bulk — масове збереження (upsert)
router.post('/bulk', async (req, res) => {
  const items = req.body; // [{alternative_id, criterion_id, mark}]
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Очікується масив' });

  try {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        let error = null;
        const stmt = db.prepare(`
          INSERT INTO Vector (Alternative_id, Criterion_id, Mark)
          VALUES (?, ?, ?)
          ON CONFLICT(Alternative_id, Criterion_id) DO UPDATE SET Mark = excluded.Mark
        `);
        for (const item of items) {
          stmt.run([item.alternative_id, item.criterion_id, item.mark], (err) => {
            if (err) error = err;
          });
        }
        stmt.finalize((err) => {
          if (err || error) {
            db.run('ROLLBACK');
            reject(err || error);
          } else {
            db.run('COMMIT', resolve);
          }
        });
      });
    });
    res.json({ success: true, saved: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
