const express = require('express');
const cors = require('cors');
const { db, init } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/lprs',         require('./routes/lprs'));
app.use('/api/alternatives', require('./routes/alternatives'));
app.use('/api/criteria',     require('./routes/criteria'));
app.use('/api/vectors',      require('./routes/vectors'));
app.use('/api/results',      require('./routes/results'));
app.use('/api/decisions',    require('./routes/decisions'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'СППР API працює!' }));

// Стартуємо сервер тільки після ініціалізації БД
init().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Сервер запущено: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('❌ Помилка ініціалізації:', err);
  process.exit(1);
});
