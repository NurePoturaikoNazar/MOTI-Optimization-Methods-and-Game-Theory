const { db } = require('../database');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    res.json(await db.allAsync('SELECT * FROM Alternative ORDER BY Alternative_id'));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  const { Alternative_name } = req.body;
  if (!Alternative_name) return res.status(400).json({ error: "Назва обов'язкова" });
  try {
    const result = await db.runAsync('INSERT INTO Alternative (Alternative_name) VALUES (?)', [Alternative_name]);
    res.status(201).json({ Alternative_id: result.lastID, Alternative_name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  const { Alternative_name } = req.body;
  try {
    const result = await db.runAsync('UPDATE Alternative SET Alternative_name = ? WHERE Alternative_id = ?', [Alternative_name, req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM Alternative WHERE Alternative_id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Не знайдено' });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
