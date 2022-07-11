from datetime import datetime

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
from pymongo import MongoClient
import certifi
ca = certifi.where()
client = MongoClient('url', tlsCAFile=ca)
db = client.dbsparta

@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')

@app.route("/", methods=["POST"])
def _post():
    sample_receive = request.form['sample_give']
    print(sample_receive)
    return jsonify({'msg': 'Post'})

@app.route("/", methods=["POST"])
def bucket_done():
    sample_receive = request.form['sample_give']
    print(sample_receive)

    return jsonify({'msg': 'POST'})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)