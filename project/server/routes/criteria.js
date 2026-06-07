const { db } = require('../database');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    res.json(await db.allAsync('SELECT * FROM Criterion ORDER BY Criterion_id'));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  const { Criterion_name } = req.body;
  if (!Criterion_name) return res.status(400).json({ error: "Назва обов'язкова" });
  try {
    const result = await db.runAsync('INSERT INTO Criterion (Criterion_name) VALUES (?)', [Criterion_name]);
    res.status(201).json({ Criterion_id: result.lastID, Criterion_name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  const { Criterion_name } = req.body;
  try {
    const result = await db.runAsync('UPDATE Criterion SET Criterion_name = ? WHERE Criterion_id = ?', [Criterion_name, req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM Criterion WHERE Criterion_id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
