const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/collective/profile
router.get('/profile', async (req, res) => {
  try {
    const rows = await db.allAsync(`
      SELECT 
        LPR.LPR_id, LPR.LPR_name, LPR.LPR_range,
        Alternative.Alternative_name,
        Result.Alternative_range
      FROM Result
      JOIN LPR ON Result.LPR_id = LPR.LPR_id
      JOIN Alternative ON Result.Alternative_id = Alternative.Alternative_id
      ORDER BY LPR.LPR_id ASC, Result.Alternative_range ASC
    `);

    // Group by LPR
    const profileMap = new Map();
    rows.forEach(row => {
      if (!profileMap.has(row.LPR_id)) {
        profileMap.set(row.LPR_id, {
          LPR_name: row.LPR_name,
          LPR_range: row.LPR_range,
          rankings: []
        });
      }
      profileMap.get(row.LPR_id).rankings.push({
        Alternative_name: row.Alternative_name,
        Alternative_range: row.Alternative_range
      });
    });

    const profile = Array.from(profileMap.values());
    res.json(profile);
  } catch (err) {
    console.error('Error fetching collective profile:', err);
    res.status(500).json({ error: 'Failed to fetch collective profile' });
  }
});

// GET /api/collective/calculate
router.get('/calculate', async (req, res) => {
  try {
    const rows = await db.allAsync(`
      SELECT 
        Alternative.Alternative_id, Alternative.Alternative_name,
        LPR.LPR_name, LPR.LPR_range,
        Result.Alternative_range
      FROM Result
      JOIN LPR ON Result.LPR_id = LPR.LPR_id
      JOIN Alternative ON Result.Alternative_id = Alternative.Alternative_id
      ORDER BY Alternative.Alternative_id ASC, LPR.LPR_id ASC
    `);

    // Calculate score for each alternative
    const altMap = new Map();
    rows.forEach(row => {
      if (!altMap.has(row.Alternative_id)) {
        altMap.set(row.Alternative_id, {
          Alternative_name: row.Alternative_name,
          totalScore: 0,
          calculations: [] // array of strings e.g. "5×5"
        });
      }
      const alt = altMap.get(row.Alternative_id);
      
      const altPoints = 6 - row.Alternative_range; // 5 балів за 1 місце, ... 0 за 6
      const expertWeight = 6 - row.LPR_range; // Вага = 6 - LPR_range

      alt.totalScore += altPoints * expertWeight;
      alt.calculations.push(`(${altPoints}×${expertWeight})`);
    });

    const results = Array.from(altMap.values());
    // Sort by totalScore descending
    results.sort((a, b) => b.totalScore - a.totalScore);

    res.json(results);
  } catch (err) {
    console.error('Error calculating collective score:', err);
    res.status(500).json({ error: 'Failed to calculate collective score' });
  }
});

module.exports = router;
