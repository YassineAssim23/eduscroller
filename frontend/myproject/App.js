// Importing React Library from 'react' module
import React from 'react';

// Importing necessary components from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing custom screens
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import PreviewScreen from './screens/PreviewScreen';
import FullArticleScreen from './screens/FullArticleScreen';

// Creating a native stack navigator
const Stack = createNativeStackNavigator();

// Main component for application
export default function App() {
  // Return navigation container with a stack navigator
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="FullArticle" component={FullArticleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
