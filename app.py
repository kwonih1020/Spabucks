from datetime import datetime

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
app = Flask(__name__)
ca = certifi.where()
client = MongoClient('mongodb+srv://junior_koo:test@cluster0.axu42.mongodb.net/?retryWrites=true&w=majority')
db = client.spabucks


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')


@app.route("/order", methods=["GET"])
def order():
    return render_template('orderService.html')


@app.route("/pay", methods=["GET"])
def pay():
    return render_template('payService.html')


@app.route("/", methods=["POST"])
def bucket_done():
    sample_receive = request.form['sample_give']
    print(sample_receive)

    return jsonify({'msg': 'POST'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)