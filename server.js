const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Настройка MySQL соединения
const db = mysql.createConnection({
  host: 'younmoney-db.cbss2kkkovs4.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'finances'
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных MySQL установлено');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Получение всех транзакций (с фильтром по типу, если он есть)
app.get('/transactions', (req, res) => {
  const filterType = req.query.type; // Получаем параметр type из запроса
  let query = 'SELECT * FROM transactions ORDER BY date DESC';
  let queryParams = [];

  // Если type задан, добавляем фильтрацию по типу
  if (filterType && (filterType === 'income' || filterType === 'expense')) {
    query = 'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC';
    queryParams = [filterType];
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Не удалось загрузить транзакции' });
    }

    // Суммируем доходы и расходы
    let totalIncome = 0;
    let totalExpense = 0;
    results.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    // Отправляем результат вместе с суммами
    res.json({ transactions: results, totalIncome, totalExpense });
  });
});


// Добавление транзакции
app.post('/transactions', (req, res) => {
  const { type, amount, description } = req.body;
  const query = 'INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)';
  db.query(query, [type, amount, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Не удалось добавить транзакцию' });
    }
    res.status(201).json({ message: 'Транзакция успешно добавлена', transactionId: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
