# Importing libraries
import datetime
import requests
from bs4 import BeautifulSoup
import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import logging
from dateutil import parser



# Configure logging to write logs to 'app.log'
logging.basicConfig(filename='app.log', filemode='w', level=logging.INFO)

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment variables
MONGOURI = os.getenv('MONGODBURI')

# Connecting to articles database using the MongoDB URI
client = MongoClient(MONGOURI)
db = client['articles']


# Creating a 'user agent' which allows sites to see who is scraping their site, ensuring we are not a bot
user_agent_edge = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.48"

# Get article links based on URL & keyword
def retrieve_article_links(url, keyword, num_pages=1):
    article_links = set()

    headers = {
        "User-Agent": user_agent_edge,
    }

    # Loop through specified number of pages
    for page_num in range(1, num_pages+1):
        # Construct URL for current page
        page_url = f"{url}/page/{page_num}/"

        try:
            # Make an HTTP GET to page
            page = requests.get(page_url)
            page.raise_for_status()
        except requests.exceptions.RequestException as e:
            # Log error if there is an issue with request
            logging.error(f"Error making request to {page_url}: {e}")
            continue

        try:
            # Parse HTML content using BeautifulSoup
            soup = BeautifulSoup(page.content, "html.parser")
        except Exception as e:
            # Log error if there is an issue with parsing HTML
            logging.error(f"Error parsing HTML for {page_url}: {e}")
            continue

        # Extract article links from parsed HTML
        for a in soup.select(".PostsContainer-list article a"):
            link = a["href"]
            # Add link to the set if it contains specified keyword above
            if keyword in link:
                article_links.add(link)

    return article_links


# Function to scrape article data using article URL
def scrape_article(article_url):
    page = requests.get(article_url)

    try:
        # Check if GET request successful
        page.raise_for_status()
    except requests.exceptions.RequestException as e:
        # Log error if issue with request
        logging.error(f"Error making request to {article_url}: {e}")
        return None

    # Parse HTML content using BeautifulSoup
    soup = BeautifulSoup(page.content, "html.parser")

    # Extract article data from parsed HTML
    try:
        # Handle different HTML structures for article titles
        article_title = soup.find("h1", class_='u-entryTitle').text.strip()
    except AttributeError:
        try:
            # Handle different HTML structures for article titles
            article_title = soup.find("h1", class_='Article-title').text.strip()
        except AttributeError:
            article_title = 'No Title Found'

    try:
        # Handle different HTML structures for article excerpts
        article_excerpt = soup.find("p", class_='Article-excerpt').text.strip()
    except AttributeError:
        article_excerpt = 'No Excerpt Found'

    try:
        # Handle different HTML structures for article author
        author_tag = soup.find("a", class_='fn author-link') or soup.find("a", class_='ArticleReviewAuthor-name author-link') or soup.find("p", class_="Article-author")
        article_author = ' '.join(author_tag.text.split()) if author_tag and author_tag.text else "No Author Found"
    except AttributeError:
        article_author = "No Author Found"



    try:
        # Handle different HTML structures for article publish date
        time_tag = soup.find('time')
        article_publish_date = time_tag['datetime'].strip() if time_tag else 'No Publish Date Found'

        if "2023" not in article_publish_date:
            return None

        publish_date_object = parser.parse(article_publish_date)
        formatted_publish_date = publish_date_object.strftime("%B %dth, %Y")

    except AttributeError:
        article_publish_date = 'No Publish Date Found'

    try:
        # Handle different HTML structures for article genre type
        article_genre = article_url.split("/")[3]  # Adjust the index based on the actual URL structure
    except IndexError:
        article_genre = 'No Genre Found'

    try:
        # Handle different HTML structures for article image
        image_tag = soup.find('div', class_='orgnc-SingleImage-wrapper').find('img')
        article_image = image_tag['src'].strip() if image_tag and "src" in image_tag.attrs else "No Image Found"
    except (AttributeError, KeyError):
        article_image = "No Image Found"

    try:
        # Handle different HTML structures for article body
        article_body = soup.find('section', class_='Article-bodyText').text.strip()
    except AttributeError:
        try:
            article_body = soup.find('div', class_='Article-bodyText paywall').text.strip()
        except AttributeError:
            article_body = 'No Body Found'

    # Once article info scraped from articles, store in respective variables
    return {
        "title": article_title,
        "author": article_author,
        "excerpt": article_excerpt,
        "genre": article_genre,
        "image": article_image,
        "publish_date": formatted_publish_date,
        "body": article_body
    }

# Function to scrape articles and save them to MongoDB database
def scrape_and_save_to_mongo(article_links, collection_name):
    collection = db[collection_name]
    
    # Go through every article link and insert data into collection if all necessary data is scraped
    for article_link in article_links:
        article_data = scrape_article(article_link)
        if article_data and all(article_data.values()):
            try:
                collection.insert_one(article_data)
            except Exception as e:
                logging.error(f"Error inserting data into MongoDB: {e}")

# Scrape articles from a category and save to database
def scrape_and_save_category(url, keyword, num_pages, collection_name):
    article_links = retrieve_article_links(url, keyword, num_pages)
    scrape_and_save_to_mongo(article_links, collection_name)

# Function to schedule article scraping for multiple categories
def schedule_article_scraping():

    # Empties all collections
    clear_collections()

    # Categories defined with URLs, keyword/genre, number of pages, and collection name
    categories = [
        ("https://www.popsci.com/category/technology", "technology", 2, "technology_articles"),
        ("https://www.popsci.com/category/environment", "environment", 2, "environment_articles"),
        ("https://www.popsci.com/category/science", "science", 2, "science_articles"),
        ("https://www.popsci.com/category/health", "health", 2, "health_articles"),
        ("https://www.popsci.com/category/gear", "gear", 2, "gear_articles"),
        ("https://www.popsci.com/category/diy", "diy", 2, "diy_articles"),
    ]

    # Scrape and save articles in each category
    for category in categories:
        scrape_and_save_category(*category)

# Clear existing collections
def clear_collections():
    collection_names = ["technology_articles", "science_articles", "environment_articles", "diy_articles", "health_articles", "gear_articles"]

    for collection_name in collection_names:
        collection = db[collection_name]
        try:
            collection.delete_many({})
        except Exception as e:
            logging.error(f"Error clearing collection {collection_name}: {e}")

# Schedule article scraping when script is run
if __name__ == "__main__":
    schedule_article_scraping()