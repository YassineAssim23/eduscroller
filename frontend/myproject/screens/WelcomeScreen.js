import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

// Define WelcomeScreen component
const WelcomeScreen = ({ navigation }) => {
  //State to store fetched genres
  const [genres, setGenres] = useState([]);

  // Fetch genres when component mounts
  useEffect(() => {
    fetchGenres();
  }, []);

  // Function to fetch genres from server
  const fetchGenres = async () => {
    try {
      // Make a GET request to server to fetch genres
      const response = await fetch('http://192.168.68.109:5000/api/genres');
      // Parse response as JSON
      const data = await response.json();
      // Update state with fetched genres
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

 // Function to handle genre selection
const handleGenrePress = (selectedGenre) => {
  // Navigate to the PreviewScreen with the selected genre
  navigation.navigate('Preview', { genre: selectedGenre });
};

  // Render component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the EDUScroll</Text>
      <Text style={styles.subtitle}>What are you interested in?</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={styles.genreTag}
            onPress={() => handleGenrePress(genre)}
          >
            <Text>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <Button title="Continue" onPress={() => /* Handle Continue */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreTag: {
    backgroundColor: '#aaf',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
});

export default WelcomeScreen;
