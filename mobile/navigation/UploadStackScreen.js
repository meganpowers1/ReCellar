/**
 *
 * UploadStackScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * UploadStackScreen represents the nested stack navigator in the
 * Upload stack, which can navigate between the UploadListing,
 * ListingInformation, and HomeScreen components.
 *
 * */

// Import the navigator from React Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screens from elsewhere
import HomeScreen from '../components/HomeScreen';
import ListingInformation from '../components/ListingInformation';
import UploadListing from '../components/UploadListing';

// Create the stack navigator
const SettingsStack = createStackNavigator();

// Export for further use
export default function UploadStackScreen() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="UploadListing" component={UploadListing} />
            <SettingsStack.Screen name="ListingInformation" component={ListingInformation} />
            <SettingsStack.Screen name="Home" component={HomeScreen} />
        </SettingsStack.Navigator>
    );
}
