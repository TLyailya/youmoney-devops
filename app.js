document.getElementById('transactionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, type }),
  });
  
  const data = await response.json();
  displayTransactions(data.transactions);
});

async function fetchTransactions() {
  const response = await fetch('/api/transactions');
  const data = await response.json();
  displayTransactions(data.transactions);
}

function displayTransactions(transactions) {
  const transactionsList = document.getElementById('transactions');
  transactionsList.innerHTML = '';
  
  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.textContent = `${transaction.type === 'income' ? 'Доход' : 'Расход'}: ${transaction.amount}`;
    transactionsList.appendChild(li);
  });
}

fetchTransactions();

