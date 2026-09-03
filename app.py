
from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)


# =================================
# DATABASE CREATE
# =================================

def create_database():

    conn = sqlite3.connect("calculator.db")

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            expression TEXT,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


# =================================
# HOME
# =================================

@app.route("/")
def home():

    return render_template("index.html")


# =================================
# CALCULATE
# =================================

@app.route("/calculate", methods=["POST"])
def calculate():

    data = request.get_json()

    num1 = data["num1"]
    num2 = data["num2"]
    operator = data["operator"]

    try:

        if operator == "+":
            result = num1 + num2

        elif operator == "-":
            result = num1 - num2

        elif operator == "*":
            result = num1 * num2

        elif operator == "/":

            if num2 == 0:
                return jsonify({
                    "error": "Cannot divide by zero"
                })

            result = num1 / num2

        elif operator == "^":
            result = num1 ** num2

        elif operator == "%":

            if num2 == 0:
                return jsonify({
                    "error": "Cannot divide by zero"
                })

            result = num1 % num2

        else:
            return jsonify({
                "error": "Invalid operator"
            })


        # =================================
        # SAVE IN DATABASE
        # =================================

        expression = f"{num1} {operator} {num2}"

        conn = sqlite3.connect("calculator.db")

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO calculations
            (expression, result)
            VALUES (?, ?)
        """, (expression, str(result)))

        conn.commit()
        conn.close()


        return jsonify({
            "result": result
        })


    except Exception as error:

        print(error)

        return jsonify({
            "error": "Something went wrong"
        })


# =================================
# GET HISTORY
# =================================

@app.route("/history", methods=["GET"])
def get_history():

    conn = sqlite3.connect("calculator.db")

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, expression, result, created_at
        FROM calculations
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()


    history = []

    for row in rows:

        history.append({
            "id": row[0],
            "expression": row[1],
            "result": row[2],
            "created_at": row[3]
        })


    return jsonify(history)


# =================================
# CLEAR HISTORY
# =================================

@app.route("/clear-history", methods=["DELETE"])
def clear_history():

    conn = sqlite3.connect("calculator.db")

    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM calculations
    """)

    conn.commit()
    conn.close()


    return jsonify({
        "message": "History cleared"
    })


# =================================
# RUN APP
# =================================

if __name__ == "__main__":

    create_database()

    app.run(debug=True)