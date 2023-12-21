// Import necessary dependencies from React and React Native
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

// Define the FullArticleScreen component
const FullArticleScreen = ({ route }) => {
    // Destructure the article object from the route parameters
    const { article } = route.params;

    // State to store the detailed article data
    const [fullArticle, setFullArticle] = useState(null);
    const [error, setError] = useState(null);

    // Fetch detailed article data when the screen mounts
    useEffect(() => {
        fetchArticleDetails();
    }, []);

    // Function to fetch detailed article data from the Flask API
    const fetchArticleDetails = async () => {
        try {
            // Make a GET request to the Flask API to get the full article details
            const response = await fetch(`http://192.168.68.104:5000/api/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genres: [article.genre] }),
            });

            // Check if the response status is OK
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

    // Load Montserrat font
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
    });

    // If fonts are not loaded, render a loading indicator
    if (!fontsLoaded) {
        return null;
    }

    // If there's an error, render an error message
    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    // If the fullArticle is not available, render a loading state or an error message
    if (!fullArticle) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Split article body into paragraphs
    const paragraphs = fullArticle.body.split('\n').map((paragraph, index) => (
        <Text key={index} style={styles.body}>
            {paragraph}
        </Text>
    ));

    // Render the FullArticleScreen component
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>{fullArticle.title}</Text>
                {fullArticle.image ? (
                    <Image source={{ uri: fullArticle.image }} style={styles.image} />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
                <Text style={styles.author}>{fullArticle.author}</Text>
                <Text style={styles.date}>{fullArticle.publish_date}</Text>
                {paragraphs}
            </View>
        </ScrollView>
    );
};

// Styles for the FullArticleScreen component
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        padding: 16,
        backgroundColor: '#f8f8f8', // Light gray background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 16,
        color: '#333', // Dark gray text
    },
    author: {
        fontSize: 18,
        color: '#555', // Slightly darker gray text
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        color: '#555',
        marginBottom: 25, // Add margin between paragraphs
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
        marginBottom: 16,
    },
    noImageText: {
        fontSize: 16,
        color: '#777', // Light gray text
        marginBottom: 16,
    },
    date: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
});

// Export the FullArticleScreen component
export default FullArticleScreen;
