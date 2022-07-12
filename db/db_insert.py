import json
from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.axu42.mongodb.net/?retryWrites=true&w=majority')
db = client.spabucks

collection_temp = db.temp
collection_size = db.size
collection_places = db.places
collection_beverage = db.beverages
collection_food = db.foods

collection_temp.delete_many({})
collection_size.delete_many({})
collection_places.delete_many({})
collection_beverage.delete_many({})
collection_food.delete_many({})

with open('temp.json') as temp:
    places_temp = json.load(temp)
with open('size.json') as size:
    places_sizes = json.load(size)
with open('places.json') as places:
    places_data = json.load(places)
with open('beverage.json') as beverage:
    beverage_data = json.load(beverage)
with open('food.json') as food:
    food_data = json.load(food)

collection_places.insert_many(places_temp)
collection_beverage.insert_many(places_sizes)
collection_places.insert_many(places_data)
collection_beverage.insert_many(beverage_data)
collection_food.insert_many(food_data)

client.close()