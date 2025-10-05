let transactions = [];
let selectedIndex = null;

function fetchTransactions() {
  fetch("/api/transactions")
    .then(res => res.json())
    .then(data => {
      transactions = data;
      selectedIndex = null;
      updateTable();
    });
}

function updateTable() {
  const table = document.getElementById("transactionTable");
  table.innerHTML = "";
  let balance = 0;

  transactions.forEach((tx, index) => {
    const row = document.createElement("tr");
    row.onclick = () => selectRow(index);

    if (selectedIndex === index) row.classList.add("selected");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${tx.date}</td>
      <td>${tx.type}</td>
      <td>${tx.category}</td>
      <td>₹ ${parseFloat(tx.amount).toFixed(2)}</td>
      <td>${tx.description}</td>
    `;

    if (tx.type === "Income") balance += parseFloat(tx.amount);
    else balance -= parseFloat(tx.amount);

    table.appendChild(row);
  });

  document.getElementById("balance").innerText = `Balance: ₹ ${balance.toFixed(2)}`;
}

function selectRow(index) {
  selectedIndex = index;
  updateTable();
}

function addTransaction() {
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value.trim();

  if (!category || isNaN(amount)) {
    alert("Please enter valid category and amount.");
    return;
  }

  fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, category, amount, description })
  }).then(() => {
    clearFields();
    fetchTransactions();
  });
}

function deleteSelected() {
  if (selectedIndex === null) {
    alert("Please select a transaction to delete.");
    return;
  }

  const id = transactions[selectedIndex].id;
  fetch(`/api/transactions/${id}`, {
    method: "DELETE"
  }).then(() => {
    fetchTransactions();
  });
}

function clearFields() {
  document.getElementById("category").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
}

fetchTransactions();
