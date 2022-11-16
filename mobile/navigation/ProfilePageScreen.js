/**
 *
 * ProfilePageScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * ProfilePageScreen represents the nested stack navigator in the
 * Login stack, which can navigate between the ProfilePage,
 * HomeScreen, and AccountSettings components
 *
 * */
// Import the stack navigator from React Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screen components
import HomeScreen from '../components/HomeScreen';
import AccountSettings from '../components/AccountSettings';
import ProfilePage from '../components/ProfilePage';

// Create a stack navigator for the settings
const SettingsStack = createStackNavigator();

// Export the profile page navigator for use elsewhere
export default function ProfilePageScreen() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="ProfilePage" component={ProfilePage} />
            <SettingsStack.Screen name="Home" component={HomeScreen} />
            <SettingsStack.Screen name="AccountSettings" component={AccountSettings} />
        </SettingsStack.Navigator>
    );
}
