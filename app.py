from datetime import datetime, timedelta
import jwt
from flask import Flask, render_template, request, jsonify, make_response
from pymongo import MongoClient
import certifi
import hashlib
import json

app = Flask(__name__)

SECRET_KEY = ''

ca = certifi.where()
client = MongoClient('', tlsCAFile=ca)
db = client.spabucks


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')


@app.route('/sign_up/check_id', methods=['POST'])
def check_id():
    user_id_receive = request.form['userId_give']
    exists = bool(db.users.find_one({"userId": user_id_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/check_nickname', methods=['POST'])
def check_nickname():
    nickname_receive = request.form['nickname_give']
    exists = bool(db.users.find_one({"nickname": nickname_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    userid_receive = request.form['userId_give']
    password_receive = request.form['password_give']
    nickname_receive = request.form['nickname_give']

    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "userId": userid_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "nickname": nickname_receive,  # 닉네임
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    userid_receive = request.form['userId_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'userId': userid_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': userid_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


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

@app.route("/pay", methods=["POST"])
def pay_complete():
    receive = request.get_json()
    data = receive['data']
    place = receive['data']['place']
    orders = receive['data']['order']
    count = db.orders.count_documents({})
    idx = count+1
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    collection_orders= {"place":place['storeName'], 'id':idx, 'userId':1, 'createDate':date, 'totalCost': receive['all_cost']}
    collection_order= list()
    for i in orders:
        order= {'productName': i['productName'], 'ordersId':idx, 'temp': i['temp'], 'size': i['size'], 'cost': i['cost'], 'count': i['count']}
        collection_order.append(order)
        # db.order.insert_many(data)
    collection_orders['order']=collection_order
    print(data)
    print(collection_orders)
    print(collection_order)
    db.orders.insert_one(collection_orders)
    db.order.insert_many(collection_order)
    return jsonify({'msg': '주문이 완료되었습니다.'})


@app.route("/pay", methods=["GET"])
def pay():
    orderList = {"place": {"contact":"1522-3232", "id":2, "storeAddress":"서울시강남구", "storeName":"압구정로"},
                "order": [{"productName":"아메리카노","temp":"ICE","size":"tall","cost":10000, "count":2, "image":"americano"},
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
    all_cost = 0
    for i in orderList["order"]:
        all_cost += i["cost"]

    # resp = make_response(render_template('payService.html', orders=orderList, all_cost=all_cost))
    # resp.set_cookie("place", "건국대")
    data = { "a" : "b", "c":[{"d":"e"}]}
    return render_template('payService.html', data=json.dumps(orderList, ensure_ascii=False), orders=orderList, all_cost=all_cost)
    # return resp

@app.route("/order_list", methods=["GET"])
def get_cookie():
    order = list(db.orders.find({}, {'_id': False}).sort("_id", -1))
    # return jsonify({'replys': replys})
    return render_template('orderList.html', data=order)


@app.route("/menu", methods=["GET"])
def getMenu():
    beverages = tuple(db.beverages.find({},{'_id':False}))
    foods = tuple(db.foods.find({},{'_id':False}))
    for b in beverages:
        b["kind"] = 'beverages'
        b['image'] = f'/static/images/food/{b["image"]}'
    for f in foods:
        f['kind'] = 'foods'
        f['image'] = f'/static/images/food/{f["image"]}'
    menus = beverages+foods
    return {'menus':menus}


@app.route("/place", methods=["GET"])
def getPlace():
    places = tuple(db.places.find({},{'_id':False}))
    return {'places':places}


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
