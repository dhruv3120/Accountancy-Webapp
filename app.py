from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('transactions.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            type TEXT,
            category TEXT,
            amount REAL,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    conn = sqlite3.connect("transactions.db")
    c = conn.cursor()
    c.execute("SELECT * FROM transactions ORDER BY id DESC")
    data = c.fetchall()
    conn.close()
    transactions = [
        {"id": row[0], "date": row[1], "type": row[2], "category": row[3], "amount": row[4], "description": row[5]}
        for row in data
    ]
    return jsonify(transactions)

@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = sqlite3.connect("transactions.db")
    c = conn.cursor()
    c.execute("INSERT INTO transactions (date, type, category, amount, description) VALUES (?, ?, ?, ?, ?)",
              (now, data["type"], data["category"], data["amount"], data["description"]))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

@app.route("/api/transactions/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    conn = sqlite3.connect("transactions.db")
    c = conn.cursor()
    c.execute("DELETE FROM transactions WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
