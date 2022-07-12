from datetime import datetime

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
import hashlib
import json

app = Flask(__name__)

ca = certifi.where()
SECRET_KEY = 'SPARTA'  # 숨겨 주세요.
client = MongoClient('mongodb+srv://junior_koo:test@cluster0.ty9x0.mongodb.net/?retryWrites=true&w=majority')
db = client.spabucks


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')


@app.route('/sign_up/check_id', methods=['POST'])
def check_id():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/check_nickname', methods=['POST'])
def check_nickname():
    nickname_receive = request.form['nickname_give']
    exists = bool(db.users.find_one({"nickname": nickname_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    nickname_receive = request.form['nickname_give']

    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "nickname": nickname_receive,  # 닉네임
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route("/order", methods=["GET"])
def order():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        return render_template('orderService.html')
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


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
        b['image'] = f'/static/images/beverage/{b["image"]}'
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