/**
 *
 * SettingsStackScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * SettingsStackScreen represents the nested stack navigator in the
 * Settings stack, which can navigate between the HomeScreen,
 * InstructionsScreen, SearchFilterScreen, FavouriteItems, and ListingInformation screens
 *
 * */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import the navigator from React
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screen components from elsewhere
import HomeScreen from '../components/HomeScreen';
import InstructionsScreen from '../components/InstructionsScreen';
import SearchFilterScreen from '../components/SearchFilterScreen';
import SearchScreen from '../components/SearchScreen';
import ListingInformation from '../components/ListingInformation';
import FavouriteItems from "../components/FavouriteItems";

// Create the stack navigator
const SettingsStack = createStackNavigator();

// Export for further use
export default function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator initialRouteName="Home">
            <SettingsStack.Screen name="Home" component={HomeScreen} />
            <SettingsStack.Screen name="Details" component={InstructionsScreen} />
            <SettingsStack.Screen name="SearchFilterScreen" component={SearchFilterScreen} />
            <SettingsStack.Screen name="SearchScreen" component={SearchScreen} />
            <SettingsStack.Screen name="ListingInformation" component={ListingInformation} />
            <SettingsStack.Screen name="FavouriteItems" component={FavouriteItems} />
        </SettingsStack.Navigator>
    );
}
