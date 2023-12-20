#Importing Libraries
from flask import Flask, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Creating Flask Application
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# Get MongoDB URI from environment variables
MONGOURI = os.getenv('MONGODBURI')

# Connecting to articles database using the MongoDB URI
client = MongoClient(MONGOURI)
db = client['articles']


# List of allowed genres
ALLOWED_GENRES = ["diy", "science", "technology", "health", "gear", "environment"]

# Route to get articles from specific collection
@app.route('/api/articles/<string:collection_name>', methods=['GET'])
def get_articles(collection_name):
    # Access specified collection in MongoDB
    collection = db[collection_name]
    # Retrieve all articles from that collection
    articles = list(collection.find())

    # Converting Object Id to string for JSON serialization
    for article in articles:
        article['_id'] = str(article['_id'])

    # Return list of articles in JSON format
    return jsonify({"articles": articles})


# Route to get genres from all collections
@app.route('/api/genres', methods=['GET'])
def get_genres():
   # Get list of all collection names in MongoDB database
   collection_names = db.list_collection_names()

   # Set to store all unique genres
   all_genres = set()

   # Going through each collection and getting distinct genres
   for collection_name in collection_names:
       collection = db[collection_name]
       genres = collection.distinct('genre')
       all_genres.update(genres)

   # Add distinct genres to set
   all_genres_list = list(all_genres)

# Defining predefined categories for certain genres
   categorized_genres = {
       "diy": "diy",
       "science": "science",
       "gear": "gear",
       "health": "health",
       "technology": "technology",
       "environment": "environment"
   }

# Creating "other" genre category for all genres not in predefined list
   for genre in all_genres:
       if genre not in ALLOWED_GENRES:
           categorized_genres[genre] = "other"
    # Extract categories from dictionary
   all_genres_list = list(categorized_genres.values())

   # Remove duplicates from the list
   all_genres_list = list(dict.fromkeys(all_genres_list))

   # Return list of genres in JSON format
   return jsonify({"genres": all_genres_list})


# Running Flask app on 0.0.0.0 so it's accessible from outside
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
