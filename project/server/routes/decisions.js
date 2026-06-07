const { db } = require('../database');
const router = require('express').Router();

// POST /history — збереження ходу попарних порівнянь
router.post('/history', async (req, res) => {
  const { lpr_id, alt1_id, alt2_id, result } = req.body;
  
  if (!lpr_id || !alt1_id || !alt2_id || result === undefined) {
    return res.status(400).json({ error: "Всі поля (lpr_id, alt1_id, alt2_id, result) обов'язкові" });
  }

  try {
    await db.runAsync(`
      INSERT INTO Comparison_History (LPR_id, Alt1_id, Alt2_id, Result)
      VALUES (?, ?, ?, ?)
    `, [lpr_id, alt1_id, alt2_id, result]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /history/clear — очищення історії порівнянь для експерта перед новою сесією
router.post('/history/clear', async (req, res) => {
  const { lpr_id } = req.body;
  if (!lpr_id) return res.status(400).json({ error: "lpr_id обов'язковий" });

  try {
    await db.runAsync('DELETE FROM Comparison_History WHERE LPR_id = ?', [lpr_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /save — збереження фінального ранжування
router.post('/save', async (req, res) => {
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
