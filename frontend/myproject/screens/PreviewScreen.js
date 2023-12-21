// PreviewScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PreviewScreen = ({ route, navigation }) => {
    const { genres } = route.params;
    const [previewArticles, setPreviewArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPreviewArticles();
    }, [genres]);

    const fetchPreviewArticles = async () => {
        try {
            // Send selected genres as an array in the request
            const response = await fetch('http://192.168.68.109:5000/api/articles', {
                method: 'POST', // Use POST method for sending data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ genres }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('Error fetching preview articles:', data.error);
                setError(data.error);
            } else {
                const randomizedArticles = data.articles.sort(() => Math.random() - 0.5);
                setPreviewArticles(randomizedArticles);
            }
        } catch (error) {
            console.error('Error fetching preview articles:', error);
            setError('An error occurred while fetching articles.');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
});

export default PreviewScreen;
