// Функция для загрузки транзакций и обновления дохода и расхода
function loadTransactions() {
  const filterType = document.getElementById('filterType').value;

  fetch(`/transactions?type=${filterType}`)
    .then(response => response.json())
    .then(data => {
      const transactions = data.transactions;
      const totalIncome = data.totalIncome;
      const totalExpense = data.totalExpense;

      const tableBody = document.querySelector('#transactions tbody');
      tableBody.innerHTML = '';  // Очищаем таблицу

      transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${transaction.type === 'income' ? 'Доход' : 'Расход'}</td>
          <td>${transaction.amount}</td>
          <td>${transaction.description || '-'}</td>
          <td>${new Date(transaction.date).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });

      // Обновляем отображение для выбранного типа транзакции
      if (filterType === 'income') {
        document.getElementById('totalIncome').textContent = `Общий доход: ${totalIncome.toFixed(2)} $`;
        document.getElementById('totalExpense').textContent = 'Общий расход: 0.00 $'; // скрываем расход
      } else if (filterType === 'expense') {
        document.getElementById('totalIncome').textContent = 'Общий доход: 0.00 $'; // скрываем доход
        document.getElementById('totalExpense').textContent = `Общий расход: ${totalExpense.toFixed(2)} $`;
      } else {
        document.getElementById('totalIncome').textContent = `Общий доход: ${totalIncome.toFixed(2)} $`;
        document.getElementById('totalExpense').textContent = `Общий расход: ${totalExpense.toFixed(2)} $`;
      }
    })
    .catch(error => console.error('Ошибка при получении транзакций:', error));
}

// Обработчик изменения фильтра
document.getElementById('filterType').addEventListener('change', function() {
  loadTransactions(); // Обновляем таблицу при изменении фильтра
});

// Инициализация страницы
loadTransactions();
