import sqlite3

conn = sqlite3.connect("cards.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM users")

tables = cursor.fetchall()

for table in tables:
    print(f"{table[0]}")

conn.close()