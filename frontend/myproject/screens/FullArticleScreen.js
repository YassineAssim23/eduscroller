// FullArticleScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const FullArticleScreen = ({ route }) => {
  const { article } = route.params;

  // State to store the detailed article data
  const [fullArticle, setFullArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch detailed article data when the screen mounts
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      // Make a GET request to your Flask API to get the full article details
      const response = await fetch(`http://192.168.68.109:5000/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genres: [article.genre] }),
      });

      // Check if the response status is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse response as JSON
      const data = await response.json();

      // Set the detailed article data in the state
      setFullArticle(data.articles.find((a) => a.title === article.title));
    } catch (error) {
      console.error('Error fetching article details:', error);
      setError(error.message);
    }
  };

  if (error) {
    // Render an error message
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!fullArticle) {
    // Render loading state or an error message
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{fullArticle.title}</Text>
        {fullArticle.image ? (
          <Image source={{ uri: fullArticle.image }} style={styles.image} />
        ) : (
          <Text>No Image Available</Text>
        )}
        <Text style={styles.author}>{fullArticle.author}</Text>
        <Text style={styles.date}>{fullArticle.publish_date}</Text>
        <Text style={styles.body}>{fullArticle.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  author: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
});

export default FullArticleScreen;
