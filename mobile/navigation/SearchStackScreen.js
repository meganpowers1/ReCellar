/**
 *
 * SearchStackScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * SearchStackScreen represents the nested stack navigator in the
 * Search stack, which can navigate between the SearchScreen,
 * ListingInformation, and FavouriteItems components.
 *
 * */

// Import the stack navigator from React Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screen components
import SearchFilterScreen from '../components/SearchFilterScreen';
import SearchScreen from '../components/SearchScreen';
import ListingInformation from '../components/ListingInformation';
import FavouriteItems from '../components/FavouriteItems';

// Create the settings stack for navigation
const SettingsStack = createStackNavigator();

// Export for further use
export default function SearchStackScreen() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="SearchScreen" component={SearchScreen} />
            <SettingsStack.Screen name="SearchFilterScreen" component={SearchFilterScreen} />
            <SettingsStack.Screen name="ListingInformation" component={ListingInformation} />
            <SettingsStack.Screen name="FavouriteItems" component={FavouriteItems} />
        </SettingsStack.Navigator>
    );
}
