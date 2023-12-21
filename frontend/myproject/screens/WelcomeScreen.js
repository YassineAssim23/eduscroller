// Import necessary dependencies from React and React Native
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

// Define WelcomeScreen component
const WelcomeScreen = ({ navigation }) => {
  // State to store fetched genres
  const [genres, setGenres] = useState([]);
  // State to store selected genres
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch genres when component mounts
  useEffect(() => {
    fetchGenres();
  }, []);

  // Function to fetch genres from the server
  const fetchGenres = async () => {
    try {
      // Make a GET request to the server to fetch genres
      const response = await fetch('http://192.168.68.104:5000/api/genres');
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
    // Toggle selected genre
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(selectedGenre)) {
        return prevSelectedGenres.filter((genre) => genre !== selectedGenre);
      } else {
        return [...prevSelectedGenres, selectedGenre];
      }
    });
  };

  // Load Montserrat font
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  // If fonts are not loaded, render a loading indicator
  if (!fontsLoaded) {
    return null;
  }

  // Render component
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/eduscrollogo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to EDUScroll</Text>
      <Text style={styles.subtitle}>What are you interested in?</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreTag,
              selectedGenres.includes(genre) && styles.selectedGenreTag,
            ]}
            onPress={() => handleGenrePress(genre)}
          >
            <Text style={styles.genreText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title="Continue"
        onPress={() => navigation.navigate('Preview', { genres: selectedGenres })}
      />
    </View>
  );
};

// Styles for the WelcomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8', // Light gray background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#333', // Dark gray text
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555', // Slightly darker gray text
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  genreTag: {
    backgroundColor: '#3498db', // Blue tag background
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  selectedGenreTag: {
    backgroundColor: '#2980b9', // Slightly darker blue for selected tag
  },
  genreText: {
    color: '#fff', // White text
  },
  logo: {
    width:250,
    height:250,
    resizeMode: 'contain',
    marginBottom: 35,
  }
});

// Export the WelcomeScreen component
export default WelcomeScreen;
