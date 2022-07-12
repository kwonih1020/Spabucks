from datetime import datetime

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
import json
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
    orderList = {"place":"건국대","order":[{"productName":"아메리카노","temp":"ICE","size":"tall","cost":10000, "count":2, "image":"americano"},
                                         {"productName":"쿨 라임 피지오","temp":"ICE","size":"venti","cost":11000, "count":2, "image":"cafe_latte"}]}
    # len = len(orderList)
    # store=request value
    # place = db.places.find_one({"storeName": "건국대"})
    # count = db.orders.count_documents({})
    # getMenu = "아메리카노"
    # order = db.beverages.find_one({"productName": getMenu})
    # temp = "ice"  # get data
    # size = "venti" # get data
    # tempAddCost = db.temp.find_one({"temp": temp})
    # sizeAddCost = db.size.find_one({"size": size})
    # date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    # print(date)
    # data = [{"id":count+1 , "place":"건국대", "order":[{"productName":"아메리카노","temp":"ICE","size":"tall","cost":4500, "count":2}], "user":"yeaseul@naver.com","createDate":date, "totalCost":4500}]
    # temp=db.beverages.find_one({"productName":"쿨 라임 피지오","temp":{"$elemMatch":{"temp":"ICE"}}})
    # order2 = {"productName":order.productName, "temp":"ICE", "size": "TALL", "cost":order.cost}
    # ordersId = request.form['ordersId']

    return render_template('payService.html', orders=orderList)


@app.route("/", methods=["POST"])
def bucket_done():
    sample_receive = request.form['sample_give']
    print(sample_receive)

    return jsonify({'msg': 'POST'})


@app.route("/menu", methods=["GET"])
def getMenu():
    beverages = tuple(db.beverages.find({},{'_id':False}))
    foods = tuple(db.foods.find({},{'_id':False}))
    for b in beverages:
        b['image'] = f'/static/images/food/{b["image"]}'
    for f in foods:
        f['image'] = f'/static/images/food/{f["image"]}'
    menus = beverages+foods
    return {'menus':menus}


@app.route("/place", methods=["GET"])
def getPlace():
    places = tuple(db.places.find({},{'_id':False}))
    return {'places':places}


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
