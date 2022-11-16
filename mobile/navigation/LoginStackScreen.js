/**
 *
 * LoginStackScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * LoginStackScreen represents the nested stack navigator in the
 * Login stack, which can navigate between the Login, Registration, and
 * Home Screen components
 *
 * */

// Import the navigator from React Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screen components
import HomeScreen from '../components/HomeScreen';
import SearchScreen from '../components/SearchScreen';
import Login from '../components/Login';
import Register from '../components/Register';

// Create the SettingsStack for navigation
const SettingsStack = createStackNavigator();

// Return the stack for use elsewhere
export default function LoginStackScreen() {
    return (
        <SettingsStack.Navigator initialRouteName="Login">
            <SettingsStack.Screen name="Login" component={Login} />
            <SettingsStack.Screen name="Register" component={Register} />
            <SettingsStack.Screen name="Home" component={HomeScreen} />
            <SettingsStack.Screen name="SearchScreen" component={SearchScreen} />
        </SettingsStack.Navigator>
    );
}
