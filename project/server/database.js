const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Помилка відкриття БД:', err.message);
  } else {
    console.log('✅ SQLite підключено:', DB_PATH);
  }
});

// Увімкнення підтримки зовнішніх ключів
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// Обгортка для промісів
db.runAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    })
  );

db.allAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    })
  );

db.getAsync = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    })
  );

// Ініціалізація схеми
const initSchema = () =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS LPR (
        LPR_id    INTEGER PRIMARY KEY AUTOINCREMENT,
        LPR_name  TEXT NOT NULL,
        LPR_range INTEGER NOT NULL CHECK (LPR_range >= 1)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Alternative (
        Alternative_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        Alternative_name TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Criterion (
        Criterion_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        Criterion_name TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Vector (
        Vector_id      INTEGER PRIMARY KEY AUTOINCREMENT,
        Alternative_id INTEGER NOT NULL,
        Criterion_id   INTEGER NOT NULL,
        Mark           REAL NOT NULL DEFAULT 0,
        FOREIGN KEY (Alternative_id) REFERENCES Alternative(Alternative_id) ON DELETE CASCADE,
        FOREIGN KEY (Criterion_id)   REFERENCES Criterion(Criterion_id)    ON DELETE CASCADE,
        CONSTRAINT UQ_Alternative_Criterion UNIQUE (Alternative_id, Criterion_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Result (
        Result_id         INTEGER PRIMARY KEY AUTOINCREMENT,
        LPR_id            INTEGER NOT NULL,
        Alternative_id    INTEGER NOT NULL,
        Alternative_range INTEGER NOT NULL CHECK (Alternative_range >= 1),
        FOREIGN KEY (LPR_id)         REFERENCES LPR(LPR_id)                 ON DELETE CASCADE,
        FOREIGN KEY (Alternative_id) REFERENCES Alternative(Alternative_id) ON DELETE CASCADE,
        CONSTRAINT UQ_LPR_Alternative UNIQUE (LPR_id, Alternative_id)
      )`, resolve);
    });
  });

// Seed-дані
const seed = async () => {
  const altCount = await db.getAsync('SELECT COUNT(*) as c FROM Alternative');
  if (altCount.c === 0) {
    const alts = ['Unity', 'Unreal Engine 5', 'GameMaker', 'Defold', 'Godot Engine', 'CryEngine'];
    for (const name of alts) {
      await db.runAsync('INSERT INTO Alternative (Alternative_name) VALUES (?)', [name]);
    }
  }

  const critCount = await db.getAsync('SELECT COUNT(*) as c FROM Criterion');
  if (critCount.c === 0) {
    const criteria = [
      'Легкість освоєння',
      'Якість 3D/2D графіки',
      'Підтримка спільноти',
      'Кросплатформеність',
      'Гнучкість розробки',
      'Фінансова доступність (Безкоштовність)',
      'Екосистема та плагіни',
    ];
    for (const name of criteria) {
      await db.runAsync('INSERT INTO Criterion (Criterion_name) VALUES (?)', [name]);
    }
  }

  const lprCount = await db.getAsync('SELECT COUNT(*) as c FROM LPR');
  if (lprCount.c === 0) {
    await db.runAsync('INSERT INTO LPR (LPR_name, LPR_range) VALUES (?, ?)', ['Студент (Головний розробник)', 1]);
  }
};

// Основна ініціалізація
const init = async () => {
  await initSchema();
  await seed();
  console.log('✅ База даних ініціалізована та заповнена');
};

module.exports = { db, init };
