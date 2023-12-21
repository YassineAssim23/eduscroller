// FullArticleScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FullArticleScreen = ({ route }) => {
  const { article } = route.params;

  // State to store the detailed article data
  const [fullArticle, setFullArticle] = useState(null);

  useEffect(() => {
    // Fetch detailed article data when the screen mounts
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      // Make a GET request to your Flask API to get the full article details
      const response = await fetch(`http://192.168.68.109:5000/api/articles/${article.genre}`);
      const data = await response.json();
      
      // Set the detailed article data in the state
      setFullArticle(data.articles.find((a) => a.title === article.title));
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  if (!fullArticle) {
    // Render loading state or an error message
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{fullArticle.title}</Text>
      <Text style={styles.author}>{fullArticle.author}</Text>
      <Text style={styles.body}>{fullArticle.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default FullArticleScreen;
