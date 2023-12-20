from flask import Flask, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
  
MONGOURI = os.getenv('MONGODBURI')
client = MongoClient(MONGOURI)
db = client['articles']


@app.route('/api/articles/<string:collection_name>', methods=['GET'])
def get_articles(collection_name):
    collection = db[collection_name]
    articles = list(collection.find())

    for article in articles:
        article['_id'] = str(article['_id'])

    return jsonify({"articles": articles})


@app.route('/api/genres', methods=['GET'])
def get_genres():
    collection_names = db.list_collection_names()

    all_genres = set()

    for collection_name in collection_names:
        collection = db[collection_name]
        genres = collection.distinct('genre')
        all_genres.update(genres)

    all_genres_list = list(all_genres)

    return jsonify({"genres": all_genres_list})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
