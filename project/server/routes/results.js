const { db } = require('../database');
const router = require('express').Router();

// GET ранги від конкретного експерта
router.get('/:lpr_id', async (req, res) => {
  try {
    const rows = await db.allAsync(`
      SELECT r.*, a.Alternative_name
      FROM Result r
      JOIN Alternative a ON a.Alternative_id = r.Alternative_id
      WHERE r.LPR_id = ?
      ORDER BY r.Alternative_range ASC
    `, [req.params.lpr_id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /bulk — масове збереження рангів
router.post('/bulk', async (req, res) => {
  const { lpr_id, rankings } = req.body; // rankings: [{alternative_id, alternative_range}]
  if (!lpr_id || !Array.isArray(rankings)) {
    return res.status(400).json({ error: "lpr_id та rankings обов'язкові" });
  }

  try {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        let error = null;
        const stmt = db.prepare(`
          INSERT INTO Result (LPR_id, Alternative_id, Alternative_range)
          VALUES (?, ?, ?)
          ON CONFLICT(LPR_id, Alternative_id) DO UPDATE SET Alternative_range = excluded.Alternative_range
        `);
        for (const r of rankings) {
          stmt.run([lpr_id, r.alternative_id, r.alternative_range], (err) => {
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
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
