from datetime import datetime

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
app = Flask(__name__)
ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.axu42.mongodb.net/?retryWrites=true&w=majority')
db = client.spabucks


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')

@app.route("/order", methods=["GET"])
def order():
    return render_template('orderService.html')

@app.route("/pay", methods=["GET"])
def pay():

    place = db.places.find_one({"storeName": "건국대"})
    getMenu = "아메리카노"
    order = db.beverages.find_one({"productName": getMenu})
    temp = "ice"  # get data
    size = "venti" # get data
    tempAddCost = db.temp.find_one({"temp": temp})
    sizeAddCost = db.size.find_one({"size": size})
    data = jsonify({
        'id': ,
        'place': place["storeName"],
        'order': request.form,
        'request.json': request.json,
    })
    # temp=db.beverages.find_one({"productName":"쿨 라임 피지오","temp":{"$elemMatch":{"temp":"ICE"}}})
    # order2 = {"productName":order.productName, "temp":"ICE", "size": "TALL", "cost":order.cost}
    return render_template('payService.html', place=place, order=order, productName=temp)

@app.route("/", methods=["POST"])
def bucket_done():
    sample_receive = request.form['sample_give']
    print(sample_receive)

    return jsonify({'msg': 'POST'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)