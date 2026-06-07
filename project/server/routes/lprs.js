const { db } = require('../database');
const router = require('express').Router();

// GET всі експерти
router.get('/', async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT * FROM LPR ORDER BY LPR_range ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST створити експерта
router.post('/', async (req, res) => {
  const { LPR_name, LPR_range } = req.body;
  if (!LPR_name || !LPR_range) return res.status(400).json({ error: "Ім'я та ранг обов'язкові" });
  try {
    const result = await db.runAsync('INSERT INTO LPR (LPR_name, LPR_range) VALUES (?, ?)', [LPR_name, LPR_range]);
    res.status(201).json({ LPR_id: result.lastID, LPR_name, LPR_range });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT оновити
router.put('/:id', async (req, res) => {
  const { LPR_name, LPR_range } = req.body;
  try {
    const result = await db.runAsync('UPDATE LPR SET LPR_name = ?, LPR_range = ? WHERE LPR_id = ?', [LPR_name, LPR_range, req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE видалити
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM LPR WHERE LPR_id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
