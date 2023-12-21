// Import necessary dependencies from React and React Native
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

// Define the PreviewScreen component
const PreviewScreen = ({ route, navigation }) => {
    // Destructure genres from the route parameters
    const { genres } = route.params;
    // States to manage preview articles, loading status, and error
    const [previewArticles, setPreviewArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch preview articles when the component mounts or genres change
    useEffect(() => {
        fetchPreviewArticles();
    }, [genres]);

    // Function to fetch preview articles from the server
    const fetchPreviewArticles = async () => {
        try {
            // Send selected genres as an array in the request
            const response = await fetch('http://192.168.68.104:5000/api/articles', {
                method: 'POST', // Use POST method for sending data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genres }),
            });

            // Parse response as JSON
            const data = await response.json();

            // Check for errors in the response
            if (data.error) {
                console.error('Error fetching preview articles:', data.error);
                setError(data.error);
            } else {
                // Randomize the order of articles
                const randomizedArticles = data.articles.sort(() => Math.random() - 0.5);
                // Set the preview articles in the state
                setPreviewArticles(randomizedArticles);
            }
        } catch (error) {
            console.error('Error fetching preview articles:', error);
            setError('An error occurred while fetching articles.');
        } finally {
            // Set loading state to false after fetching articles
            setLoading(false);
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

    // Render each article in the FlatList
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.articleContainer}
                onPress={() => navigation.navigate('FullArticle', { article: item })}
            >
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleAuthor}>{item.author}</Text>
                <Text style={styles.articleGenre}>{item.genre}</Text>
                <Text style={styles.articleDate}>{item.publish_date}</Text>
                <Text style={styles.articleExcerpt}>{item.excerpt}</Text>
                <Image
                    source={{ uri: item.image }}
                    style={styles.articleImage}
                    onError={(error) => console.error('Image Error:', error)}
                />
            </TouchableOpacity>
        );
    };

    // Render the component
    return (
        <View style={styles.container}>
            {/* Render loading state, error state, or the FlatList of preview articles */}
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
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

// Styles for the PreviewScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8', // Light gray background
    },
    articleContainer: {
        backgroundColor: '#fff', // White background
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 8,
        color: '#333', // Dark gray text
    },
    articleAuthor: {
        fontSize: 16,
        color: '#555', // Slightly darker gray text
        marginBottom: 4,
    },
    articleGenre: {
        fontSize: 14,
        color: '#3498db', // Blue genre text
        marginBottom: 4,
    },
    articleDate: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    articleExcerpt: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    articleImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
});

// Export the PreviewScreen component
export default PreviewScreen;
