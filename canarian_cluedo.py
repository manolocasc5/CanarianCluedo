from flask import Flask, render_template, request, jsonify
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/juego')
def juego():
    return render_template('juego.html')

@app.route('/execute', methods=['POST'])
def execute_query():
    query = request.json.get('query')
    try:
        connection = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
        connection.close()
        return jsonify({'success': True, 'columns': columns, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
