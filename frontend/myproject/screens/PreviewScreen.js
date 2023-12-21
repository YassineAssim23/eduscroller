// PreviewScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PreviewScreen = ({ route, navigation }) => {
  const { genre } = route.params;

  // State to store the preview articles
  const [previewArticles, setPreviewArticles] = useState([]);

  useEffect(() => {
    // Fetch preview articles when the component mounts
    fetchPreviewArticles();
  }, []);

  const fetchPreviewArticles = async () => {
    try {
      const response = await fetch(`http://192.168.68.109:5000/api/articles/${genre}`);
      const data = await response.json();
      console.log('Fetched data:', data); // Log the data to the console
      setPreviewArticles(data.articles);
    } catch (error) {
      console.error('Error fetching preview articles:', error);
    }
  };

  const renderItem = ({ item }) => {
    console.log('Image URL:', item.image); // Log the image URL to the console
    return (
      <TouchableOpacity
        style={styles.articleContainer}
        onPress={() => navigation.navigate('FullArticle', { article: item })}
      >
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleAuthor}>{item.author}</Text>
        <Text style={styles.articleDate}>{item.publish_date}</Text>
        <Text style={styles.articleExcerpt}>{item.excerpt}</Text>
        <Image
          source={{ uri: item.image }}
          style={styles.articleImage}
          onError={(error) => console.error('Image Error:', error)} // Log image loading errors
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{genre} Articles</Text>
      {previewArticles.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={previewArticles}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
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
  articleContainer: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articleAuthor: {
    fontSize: 16,
    color: 'gray',
  },
  articleExcerpt: {
    fontSize: 14,
    marginTop: 8,
  },
  articleImage: {
    width: 200, // Set a specific width
    height: 200, // Set a specific height
    resizeMode: 'cover', // or 'contain'
  },
});

export default PreviewScreen;
