# EDUScroll

EDUScroll is a content aggregator app that provides users with short but educational articles across various genres such as technology, science, health, and more. The app consists of three main components: a web scraper written in Python, a Flask API to serve article data, and a React Native mobile app for users to explore and read 
articles.

<img src="https://snipboard.io/7ogFzZ.jpg" alt="App Screenshot"/>



## Table of Contents

- [Overview](#overview)
- [Web Scraper](#web-scraper)
- [Flask API](#flask-api)
- [React Native App](#react-native-app)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [MIT License](#mit-license)

## Overview

EDUScroll aims to deliver educational content in a convenient and user-friendly manner. Users can select their preferred genres, and the app will present them with a curated list of articles for an engaging reading experience.

## Web Scraper

The web scraper module is responsible for fetching articles from popsci.com based on specified categories and keywords. Key functionalities include:

Retrieving Article Links: The scraper fetches article links from the website based on a provided URL, keyword, and the number of pages to scrape.

Scraping Article Data: For each article link, the scraper extracts relevant information such as title, author, genre, publish date, excerpt, image, and body content.

Storing in MongoDB: The scraped article data is stored in a MongoDB database, categorized by genres, ensuring efficient retrieval.

## Flask API

The Flask API serves as the backend for the mobile app, providing endpoints for fetching articles and genres. Key features include:

Fetching Articles: Users can request articles based on selected genres, and the API returns a randomized list of articles for a diverse reading experience.

Fetching Genres: The API provides a list of available genres, categorizing them into predefined categories and creating an "other" category for genres not in the predefined list.

Error Handling: The API handles errors gracefully and returns informative messages for better user experience.

## React Native App

The React Native app allows users to interact with the content fetched from the Flask API. Key features include:

Welcome Screen: Users are welcomed with an introduction and asked to select their interests among the available genres.

Preview Screen: Users can preview a randomized list of articles based on their selected genres.

Full Article Screen: Users can read the full article with details such as title, author, publish date, and body content.

## Installation

 Clone the repository:

   ```bash
   git clone https://github.com/YassineAssim23/eduscroll.git
   cd eduscroll
```

## Usage

1. Start Web Scraper to populate MongoDB database with articles:
```bash
cd eduscroll/backend
python scraper.py
```

2. Run Flask API:
```bash
cd eduscroll/backend
python app.py
```


3. Start React Native App:
```bash
cd eduscroll/frontend/myproject
expo start
```

Follow the instructions to run the app on an emulator or physical device.


## Contributing
If you'd like to contribute to EDUScroll, please follow these guidelines:

  1. Fork the repository.
  2. Create a new branch for your feature or bug fix.
  3. Implement your changes.
  4. Test thoroughly.
  5. Submit a pull request.


## MIT License
MIT License

Copyright (c) 2023 Yassine Assim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
